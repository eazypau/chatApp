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
  arrayRemove,
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
  isUnsubscribe: boolean;
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
    isUnsubscribe: false,
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
          // console.log("trigger update email");
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
    // change to add a contact doc in the user profile to save all the added user id
    // then when fetching contact, can just use userId and list down the contacts
    async addUserContact(email: string) {
      let contacts: any = {};
      // check if is your own email
      if (email === this.profile.email) {
        triggerMessage("You are not allowed to add yourself.");
        return;
      }
      try {
        // check whether the user exist with the email as the input
        const q = query(userProfileCollection, where("email", "==", email));
        const fetchUserDoc = await getDocs(q);
        fetchUserDoc.forEach((doc) => {
          contacts = doc.data();
        });
        // if exist
        if (Object.keys(contacts).length > 0) {
          // check whether contact exist in userProfile
          for (let i = 0; i < this.profile.contacts.length; i++) {
            const userId = this.profile.contacts[i];
            if (userId === contacts.id) {
              triggerMessage(
                "This is a existing contacts. Please provide a valid email to add new contacts."
              );
              return;
            }
          }
        }
        const addUserContact = await updateDoc(doc(userProfileCollection, this.user), {
          contacts: arrayUnion(contacts.id),
        });
        // await this.fetchUserProfile();
        this.contactList.push(contacts);
        triggerMessage("Successfully added new contact.");
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    async fetchContactList() {
      try {
        this.contactList = [];
        for (let i = 0; i < this.profile.contacts.length; i++) {
          const id = this.profile.contacts[i];
          const fetchUser: any = await getDoc(doc(userProfileCollection, id));
          if (fetchUser.exists()) {
            this.contactList.push(fetchUser.data());
          }
          this.contactList = [...new Set(this.contactList)];
        }

        // const q = query(userProfileCollection)
        // const unsubscribe = onSnapshot(q, (querySnapShot: any) => {
        //   this.contactList = []
        //   querySnapShot.forEach((doc: any) => {
        //     this.contactList.push(doc.data())
        //   });
        // })
        // console.log(this.contactList);
      } catch (error: any) {
        triggerMessage(error.message);
      }
    },
    //* reference: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5
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
          if (this.isUnsubscribe) {
            unsub();
          }
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
      if (this.isUnsubscribe) {
        unsubscribe();
      }
      // console.log(this.currentChatContent);
    },
    async fetchChatDocument(members: string[]) {
      const chatContainer: Object[] = [];
      let findChat = query(chatCollection, where("members", "==", members));
      const fetchAllChats = await getDocs(findChat);
      fetchAllChats.forEach((doc) => {
        chatContainer.push(doc.data());
      });
      // console.log(chatContainer);
      return chatContainer;
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
        // console.log(messageContent);
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
          await this.fetchUserProfile();
          await this.fetchChatList();
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
      // console.log("user does not exist");
    },
    deleteProfileImg() {
      const imageRef = ref(storage, this.profile.id);
      deleteObject(imageRef)
        .then(() => {
          // console.log("successfully deleted photo.");
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
    // async deleteChatDoc(id: string) {
    //   try {
    //     // for (let i = 0; i < this.currentChatContent.length; i++) {
    //     //   const msgId = this.currentChatContent[i].id;
    //     //   await deleteDoc(doc(chatCollection, id, "messages", msgId));
    //     // }
    //     // await deleteDoc(doc(chatCollection, id));
    //     console.log(id);
    //     await updateDoc(doc(userProfileCollection, this.profile.id), {
    //       chatGroupIds: arrayRemove(id),
    //     });
    //     this.currentChatContent = [];
    //     this.chatList = this.chatList.filter((item: any) => {
    //       return item.id !== id;
    //     });
    //     console.log(this.chatList);
    //   } catch (error: any) {
    //     console.log(error.message);
    //   }
    // },
  },
});
