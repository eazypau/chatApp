import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
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
} from "@firebase/firestore";
import { chatCollection, db, storage, userProfileCollection } from "../firebase/firebase";
import { updateUserEmail, updateUserName, updateUserPhoto } from "../firebase/profile";

interface ChatState {
  user: any;
  profile: any;
  contactList: contactsObj[];
  chatList: messageObj[];
  currentChatContent: currentChatObj[];
  currentChatInfo: any;
  currentChatId: string;
}

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    user: localStorage.getItem("firebaseToken"),
    profile: {} as userObj,
    contactList: [],
    chatList: [],
    currentChatContent: [],
    currentChatInfo: {},
    currentChatId: "",
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
      } catch (error) {
        console.log(error);
      }
    },
    async updateUserProfileInfo(newProfileInfo: { name: string; email: string }) {
      try {
        updateUserName(this.user, newProfileInfo.name);
        updateUserAccEmail(newProfileInfo.email);
        updateUserEmail(this.user, newProfileInfo.email);
        this.profile.name = newProfileInfo.name;
        this.profile.email = newProfileInfo.email;
      } catch (error) {
        console.log(error);
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
            console.log("Upload is " + progress + "% done");
            if (progress === 100) {
              // store.commit('loadingStatus', false);
              // store.commit('changeImgSrc', URL.createObjectURL(file));
              alert("Upload complete!");
            }
          },
          (error) => {
            console.log("Fail to upload new profle picture...");
            console.log(error);
            alert("Failed to update profile picture...");
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log("File available at", downloadURL);
              this.profile.photo = downloadURL;
              updateUserPhoto(this.user, downloadURL);
            });
          }
        );
      } catch (error:any) {
        alert(error.message);
      }
    },
    async addUserContact(email: string) {
      // search profile by email
      let contacts: any = {};
      let duplicate = [];
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
        alert("contact already exist!");
        return
      }
      const q: any = query(userProfileCollection, where("email", "==", email));
      // if exist add
      const findDoc: any = await getDocs(q);
      // });
      try {
        findDoc.forEach((doc: any) => {
          // contacts.push(doc.data());
          contacts = doc.data();
        });
        const addContactDoc = await addDoc(userContactCollectionRef, contacts);
        console.log(addContactDoc.id);
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
        alert("successfully add contact.");
      } catch (error) {
        console.log(error);
      }
    },
    async fetchContactList() {
      // this.contactList = [];
      try {
        const userContactCollectionRef = collection(userProfileCollection, this.user, "contacts");
        const queryDocs = query(userContactCollectionRef);
        // const querySnapshot = onSnapshot(queryDocs);
        // querySnapshot.forEach((doc: any) => {
        //   this.contactList.push(doc.data());
        // });
        const unsubscribe = onSnapshot(queryDocs, (querySnapshot: any) => {
          this.contactList = [];
          querySnapshot.forEach((doc: any) => {
            this.contactList.push(doc.data());
          });
          // console.log("Current messages ", this.currentChatContent.join(", "));
        });
        // console.log(this.contactList);
      } catch (error) {
        console.log(error);
      }
    },
    //* for creating/saving chat
    //* maybe save the id as an array in participants (2 elements in an array)
    //* maybe can take this as ref: https://www.c-sharpcorner.com/article/chat-app-data-structure-in-firebase-firestore/
    //* better reference: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5
    async fetchChatList() {
      this.chatList = [];
      if (this.profile.chatGroupIds.length) {
        // const chatCollection = collection(db, "chats")
        try {
          for (let i = 0; i < this.profile.chatGroupIds.length; i++) {
            const chatId = this.profile.chatGroupIds[i];
            const fetchChat: any = await getDoc(doc(chatCollection, chatId));
            if (fetchChat.exists) {
              this.chatList.push(fetchChat.data());
            }
          }
          // console.log(this.chatList);
        } catch (error) {
          console.log(error);
        }
      }
    },
    async fetchCurrentChat(chatId: string) {
      // this.currentChatContent = [];
      const findCurrentChatContent = query(
        collection(chatCollection, chatId, "messages"),
        orderBy("sentAt")
      );
      // const fetchChatMessages = await getDocs(findCurrentChatContent);
      // fetchChatMessages.forEach((doc) => {
      //   this.currentChatContent.push(doc.data());
      // });
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
        const createMsgDoc = await addDoc(messageSubCollection, {
          text: messageContent.text,
          sentAt: serverTimestamp(),
          sendBy: messageContent.senderId,
          senderName: messageContent.senderName,
        });
        // after that update the chatsDoc in the recentMessage
        await updateDoc(chatDocRef, {
          "recentMessage.messageText": messageContent.text,
          "recentMessage.sendBy": messageContent.senderId,
          "recentMessage.sentAt": serverTimestamp(),
          "recentMessage.senderName": messageContent.senderName,
        });
        if (firstTime) {
          await this.fetchCurrentChat(messageContent.chatId);
        }
      } catch (error) {
        console.log(error);
      }
    },
    async fetchOtherUserDetails(id: string) {
      const fetchOtherUser = await getDoc(doc(userProfileCollection, id));
      if (fetchOtherUser.exists()) {
        return fetchOtherUser.data();
      }
      console.log("user does not existi");
    },
    //TODO: need to use onSnapShot to listen to changes in firestore collection
    //* ref: https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection
    //* ref: https://stackoverflow.com/questions/48606611/firestore-listen-to-update-on-the-entire-collection/48608816
  },
});
