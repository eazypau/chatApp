import { initializeApp } from 'firebase/app';
import { getFirestore, collection } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAuth, onAuthStateChanged, Unsubscribe } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN + '.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE + '.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET + '.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore();
const userProfileCollection = collection(db, "userCollection")
const chatCollection = collection(db, "chats")
const storage = getStorage(); 
const auth = getAuth()
const getCurrentUser = () => {
  return new Promise<boolean>((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user:any) => {
      unsubscribe()
      if (user) {
        resolve(true)
      } else {
        resolve(false)
      }
    })
  })
}

export { db, userProfileCollection, chatCollection, storage, auth, getCurrentUser };

//* access/create sub-collection, reference: https://firebase.google.com/docs/firestore/data-model
//* maybe need to use arrayUnion, reference: https://firebase.google.com/docs/firestore/manage-data/add-data