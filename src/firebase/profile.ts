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

export { createUserProfile, updateUserName, updateUserEmail, updateUserPhoto };
