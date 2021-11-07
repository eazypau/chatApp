import { doc, getDoc, setDoc, updateDoc } from "@firebase/firestore";
import { Profile } from "../classes/constructor";
import { user } from "../classes/type";
import { useStore } from "../store/store";
import { db } from "./firebase";

const createUserProfile = async (userDetails: user) => {
  const uid = userDetails.id;
  const name = userDetails.name;
  const email = userDetails.email;
  const photo = userDetails.photo;
  await setDoc(doc(db, "userCollection", uid), new Profile(uid, name, email, photo));
};

const readUserProfile = async (userId: string) => {
  const docRef = doc(db, "userCollection", userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const store = useStore();
    const docData = docSnap.data();
    store.profile.id = docData.id;
    store.profile.email = docData.email;
    store.profile.name = docData.name;
    store.profile.photo = docData.photo;
  }
};

const updateUserName = async (userId: string, newName: string) => {
  const docRef = doc(db, "userCollection", userId);
  await updateDoc(docRef, {
    name: newName,
  });
};
const updateUserEmail = async (userId: string, newEmail: string) => {
  const docRef = doc(db, "userCollection", userId);
  await updateDoc(docRef, {
    email: newEmail,
  });
};
const updateUserPhoto = async (userId: string, newPhotoURL: string) => {
  const docRef = doc(db, "userCollection", userId);
  await updateDoc(docRef, {
    photo: newPhotoURL,
  });
};

export { createUserProfile, updateUserName, updateUserEmail, updateUserPhoto };
