import { getDownloadURL, ref, uploadBytesResumable } from "@firebase/storage";
import { defineStore } from "pinia";
import { contactsObj, userObj } from "../classes/type";
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
} from "@firebase/firestore";
import { db, storage } from "../firebase/firebase";
import { updateUserEmail, updateUserName, updateUserPhoto } from "../firebase/profile";

interface ChatState {
  user: string;
  profile: any;
  contactList: contactsObj[];
}

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    user: "",
    profile: {} as userObj,
    contactList: [],
  }),
  getters: {
    getProfile(state) {
      return state.profile;
    },
    getContactList(state) {
      return state.contactList;
    },
  },
  actions: {
    async fetchUserProfile() {
      try {
        const docRef = doc(db, "userCollection", this.user);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          console.log(docSnap.data());
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
      } catch (error) {}
    },
    async addUserContact(email: string) {
      // search profile by email
      let contacts: any = {};
      const userCollectionRef = collection(db, "userCollection");
      const userContactCollectionRef = collection(db, "userCollection", this.user, "contacts");
      const q: any = query(userCollectionRef, where("email", "==", email));
      // if exist add
      const findDoc: any = await getDocs(q);
      // findDoc.forEach((doc: any) => {
      //   // contacts.push(doc.data());
      //   contacts = doc.data();
      //   console.log(doc.data());

      // });
      try {
        findDoc.forEach((doc: any) => {
          // contacts.push(doc.data());
          contacts = doc.data();
        });
        const addContactDoc = await addDoc(userContactCollectionRef, contacts);
        console.log(addContactDoc.id);
        const updateDocWithId = await updateDoc(
          doc(db, "userCollection", this.user, "contacts", addContactDoc.id),
          {
            docId: addContactDoc.id,
          }
        );
        // trigger fetch contacts
        await this.fetchContactList();
      } catch (error) {
        console.log(error);
      }
    },
    async fetchContactList() {
      this.contactList = [];
      const userContactCollectionRef = collection(db, "userCollection", this.user, "contacts");
      const querySnapshot = await getDocs(userContactCollectionRef);
      querySnapshot.forEach((doc: any) => {
        this.contactList.push(doc.data());
      });
    },
    //* for creating/saving chat
    //* maybe save the id as an array in participants (2 elements in an array)
    //* maybe can take this as ref: https://www.c-sharpcorner.com/article/chat-app-data-structure-in-firebase-firestore/
    //* better reference: https://levelup.gitconnected.com/structure-firestore-firebase-for-scalable-chat-app-939c7a6cd0f5
    async createChat(chatDoc: any) {
      const chatCollection = collection(db, "chats", chatDoc.id);
      const createChatDoc: any = addDoc(chatCollection, chatDoc);
      const docRef = doc(db, "userCollection", this.user);
      await updateDoc(doc(db, "chats", createChatDoc.id), {
        id: createChatDoc.id,
      });
      await updateDoc(docRef, {
        chatGroupIds: arrayUnion(createChatDoc.id),
      });
    },
    async sendMessage(message: any) {
      console.log("send message");
      const messageSubCollection = collection(db, "chats", message.chatId, "messages");
      const createMsgDoc = addDoc(messageSubCollection, {
        text: message.text,
        sentAt: serverTimestamp(),
        sendBy: message.senderId,
      });
    },
    //TODO: need to use onSnapShot to listen to changes in firestore collection
    //* ref: https://firebase.google.com/docs/firestore/query-data/listen#listen_to_multiple_documents_in_a_collection
    //* ref: https://stackoverflow.com/questions/48606611/firestore-listen-to-update-on-the-entire-collection/48608816
  },
});
