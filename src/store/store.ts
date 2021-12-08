import { deleteObject, getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { defineStore } from "pinia";
import { contactsObj, currentChatObj, messageObj, userObj } from "../classes/type";
import { updateUserAccEmail } from "../firebase/auth";
import {
  collection,
  doc,
  getDoc,
  updateDoc,
  where,
  query,
  addDoc,
  getDocs,
  arrayUnion,
  serverTimestamp,
  orderBy,
  onSnapshot,
  deleteDoc,
} from "@firebase/firestore";
import { chatCollection, db, storage, userProfileCollection } from "../firebase/firebase";
import { updateUserEmail, updateUserName, updateUserPhoto } from "../firebase/profile";
import useNotification from "../composable/useNotification";

interface ChatState {
  user: any;
  profile: any;
  contactList: contactsObj[];
  chatList: messageObj[];
  currentChatContent: currentChatObj[];
  currentChatInfo: any;
  currentChatId: string;
  otherUser: any;
}

const { triggerMessage } = useNotification();

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    user: localStorage.getItem("firebaseToken"),
    profile: {} as userObj,
    contactList: [],
    chatList: [],
    currentChatContent: [],
    currentChatInfo: {},
    currentChatId: "",
    otherUser: {} as userObj,
  }),
  getters: {
    getProfile(state) {
      return state.profile;
    },
    getContactList(state) {
      return state.contactList;
    },
    getChatList(state) {
      return state.chatList;
    },
    getChatContent(state) {
      return state.currentChatContent;
    },
    getCurrentChatId(state) {
      return state.currentChatId;
    },
    getOtherUser(state) {
      return state.otherUser;
    },
  },
  actions: {
    async fetchUserProfile() {
      try {
        const docRef = doc(userProfileCollection, this.user);
        const docSnap = await getDoc(docRef);
        // console.log(docSnap.data());
        if (docSnap.exists()) {
          // console.log(docSnap.data());
          this.profile = docSnap.data();
        }
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async updateUserProfileInfo(newProfileInfo: { name: string; email: string }) {
      try {
        updateUserName(this.user, newProfileInfo.name);
        if (newProfileInfo.email !== this.profile.email) {
          console.log("trigger update email");

          updateUserAccEmail(newProfileInfo.email);
          updateUserEmail(this.user, newProfileInfo.email);
          this.profile.email = newProfileInfo.email;
        }
        this.profile.name = newProfileInfo.name;
        triggerMessage("Successfully update profile details.");
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async uploadProfileImage(file: any) {
      try {
        const uid = this.user;
        const storageRef = ref(storage, uid);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            // console.log("Upload is " + progress + "% done");
            if (progress === 100) {
              // store.commit('loadingStatus', false);
              // store.commit('changeImgSrc', URL.createObjectURL(file));
              triggerMessage("Upload complete!");
            }
          },
          (error) => {
            // console.log("Fail to upload new profle picture...");
            // console.log(error);
            triggerMessage("Failed to update profile picture...");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              // console.log("File available at", downloadURL);
              this.profile.photo = downloadURL;
              updateUserPhoto(this.user, downloadURL);
              triggerMessage("Successfully updated profile picture.");
            });
          }
        );
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async addUserContact(email: string, name: string) {
      // search profile by email
      if (email === this.profile.email) {
        triggerMessage("You are not allowed to add yourself.");
        return;
      }
      let contacts: any = {};
      let duplicate: any = [];
      const userContactCollectionRef = collection(userProfileCollection, this.user, "contacts");
      const checkDuplicate = query(userContactCollectionRef, where("email", "==", email));
      const getDuplciate = await getDocs(checkDuplicate);
      try {
        getDuplciate.forEach((doc: any) => {
          duplicate.push(doc.data());
        });
      } catch (error) {
        console.log(error);
      }
      if (duplicate.length > 0) {
        triggerMessage("Contact already exist!");
        return;
      }
      const q: any = query(userProfileCollection, where("email", "==", email));
      const isExist: any = [];
      // if exist add
      const findDoc: any = await getDocs(q);
      findDoc.forEach((doc: any) => {
        isExist.push(doc.data());
      });
      if (isExist.length === 0) {
        triggerMessage("Contact does not exist! Please try again.");
        return;
      }
      try {
        findDoc.forEach((doc: any) => {
          contacts = doc.data();
        });
        contacts.name = name
        const addContactDoc = await addDoc(userContactCollectionRef, contacts);
        // console.log(addContactDoc.id);
        const updateDocWithId = await updateDoc(
          doc(userProfileCollection, this.user, "contacts", addContactDoc.id),
          {
            docId: addContactDoc.id,
          }
        );
        // trigger fetch contacts
        if (!this.contactList) {
          await this.fetchContactList();
        }
        triggerMessage("Successfully add contact.");
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async fetchContactList() {
      // this.contactList = [];
      try {
        const userContactCollectionRef = collection(userProfileCollection, this.user, "contacts");
        const queryDocs = query(userContactCollectionRef);
        const unsubscribe = onSnapshot(queryDocs, (querySnapshot: any) => {
          this.contactList = [];
          querySnapshot.forEach((doc: any) => {
            this.contactList.push(doc.data());
          });
          // console.log("Current messages ", this.currentChatContent.join(", "));
        });
        // console.log(this.contactList);
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    //* for creating/saving chat
    //* maybe save the id as an array in participants (2 elements in an array)
    //* maybe can take this as ref: https://www.c-sharpcorner.com/article/chat-app-data-structure-in-firebase-firestore/
    //* better reference: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5
    async fetchChatList() {
      if (this.profile.chatGroupIds.length) {
        try {
          const unsub = onSnapshot(chatCollection, (snapShot: any) => {
            let fetchedChat: any[] = [];
            this.chatList = [];
            snapShot.forEach((doc: any) => {
              fetchedChat.push(doc.data());
            });
            for (let i = 0; i < this.profile.chatGroupIds.length; i++) {
              const chatId = this.profile.chatGroupIds[i];
              for (let j = 0; j < fetchedChat.length; j++) {
                const fetchedChatId = fetchedChat[j].id;
                if (fetchedChatId === chatId) {
                  this.chatList.push(fetchedChat[j]);
                  break;
                }
              }
            }
            // console.log(this.chatList);
          });
        } catch (error: any) {
          triggerMessage(error.message);
        }
      }
    },
    async fetchCurrentChat(chatId: string) {
      const findCurrentChatContent = query(
        collection(chatCollection, chatId, "messages"),
        orderBy("sentAt")
      );
      const unsubscribe = onSnapshot(findCurrentChatContent, (querySnapshot: any) => {
        this.currentChatContent = [];
        querySnapshot.forEach((doc: any) => {
          this.currentChatContent.push(doc.data());
        });
        // console.log("Current messages ", this.currentChatContent.join(", "));
      });
      // console.log(this.currentChatContent);
    },
    async createChat() {
      // const chatCollection = collection(db, "chats");
      const createChatDoc: any = await addDoc(chatCollection, {
        members: this.currentChatInfo.members,
        recentMessage: {
          messageText: "",
          sendBy: "",
          sentAt: "",
          senderName: "",
        },
        createdAt: serverTimestamp(),
        createdBy: this.currentChatInfo.createdBy,
        type: this.currentChatInfo.type,
      });
      const docRef = doc(userProfileCollection, this.user);
      await updateDoc(doc(chatCollection, createChatDoc.id), {
        id: createChatDoc.id,
      });
      // add chat id into current user
      await updateDoc(docRef, {
        chatGroupIds: arrayUnion(createChatDoc.id),
      });
      // add the chat id into the other user doc
      await updateDoc(doc(db, "userCollection", this.currentChatInfo.members[1]), {
        chatGroupIds: arrayUnion(createChatDoc.id),
      });
      return createChatDoc.id;
    },
    async sendMessage(message: {
      senderName: string;
      text: string;
      senderId: string;
      chatId: string;
    }) {
      let firstTime = false;
      let messageContent = message;
      if (message.chatId === "") {
        const getId = await this.createChat();
        messageContent.chatId = getId;
        firstTime = true;
        this.currentChatId = getId;
        console.log(messageContent);
      }
      const chatDocRef = doc(chatCollection, messageContent.chatId);
      const messageSubCollection = collection(chatCollection, messageContent.chatId, "messages");
      try {
        const createMsgDoc: any = await addDoc(messageSubCollection, {
          text: messageContent.text,
          sentAt: serverTimestamp(),
          sendBy: messageContent.senderId,
          senderName: messageContent.senderName,
          id: "",
        });
        // console.log(createMsgDoc.id);
        await updateDoc(doc(chatCollection, messageContent.chatId, "messages", createMsgDoc.id), {
          id: createMsgDoc.id,
        });
        // after that update the chatsDoc in the recentMessage
        // console.log("did it failed here?");
        await updateDoc(chatDocRef, {
          "recentMessage.messageText": messageContent.text,
          "recentMessage.sendBy": messageContent.senderId,
          "recentMessage.sentAt": serverTimestamp(),
          "recentMessage.senderName": messageContent.senderName,
        });
        // console.log("passed update");
        if (firstTime) {
          await this.fetchUserProfile()
          await this.fetchChatList()
          await this.fetchCurrentChat(messageContent.chatId);
        }
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async fetchOtherUserDetails(id: string) {
      this.otherUser = {};
      const fetchOtherUser = await getDoc(doc(userProfileCollection, id));
      if (fetchOtherUser.exists()) {
        this.otherUser = fetchOtherUser.data();
        return fetchOtherUser.data();
      }
      console.log("user does not exist");
    },
    async deleteContact(docId: string) {
      try {
        await deleteDoc(doc(userProfileCollection, this.profile.id, "contacts", docId));
      } catch (error: any) {
        console.log(error.message);
      }
    },
    deleteProfileImg() {
      const imageRef = ref(storage, this.profile.id);
      deleteObject(imageRef)
        .then(() => {
          console.log("successfully deleted photo.");
        })
        .catch((err) => {
          console.log(err.message);
        });
    },
    async deleteProfileDoc() {
      try {
        await deleteDoc(doc(userProfileCollection, this.profile.id));
      } catch (error: any) {
        console.log(error.message);
      }
    },
    async deleteChatDoc(id: string) {
      try {
        for (let i = 0; i < this.currentChatContent.length; i++) {
          const msgId = this.currentChatContent[i].id;
          await deleteDoc(doc(chatCollection, id, "messages", msgId));
        }
        await deleteDoc(doc(chatCollection, id));
      } catch (error: any) {
        console.log(error.message);
      }
    },
  },
});
