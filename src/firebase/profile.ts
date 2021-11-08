import { doc, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import { Profile } from '../classes/constructor';
import { user } from '../classes/type';
import { useStore } from '../store/store';
import { db } from './firebase';

const createUserProfile = async (userDetails: user) => {
  // console.log(userDetails);
  try {
    setDoc(doc(db, 'userCollection', userDetails.id), userDetails);
  } catch (error: any) {
    console.log(error.message);
  }
};

const readUserProfile = async (userId: string) => {
  const docRef = doc(db, 'userCollection', userId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(docSnap.data());
    return docSnap.data();
  } else {
    return console.log('User profile does not exist');
  }
};

const updateUserName = async (userId: string, newName: string) => {
  const docRef = doc(db, 'userCollection', userId);
  await updateDoc(docRef, {
    name: newName,
  });
};
const updateUserEmail = async (userId: string, newEmail: string) => {
  const docRef = doc(db, 'userCollection', userId);
  await updateDoc(docRef, {
    email: newEmail,
  });
};
const updateUserPhoto = async (userId: string, newPhotoURL: string) => {
  const docRef = doc(db, 'userCollection', userId);
  await updateDoc(docRef, {
    photo: newPhotoURL,
  });
};

export { createUserProfile, readUserProfile, updateUserName, updateUserEmail, updateUserPhoto };
