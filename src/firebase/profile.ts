import { doc, getDoc, setDoc, updateDoc } from '@firebase/firestore';
import { Profile } from '../classes/constructor';
import { userObj } from '../classes/type';
import { userProfileCollection } from './firebase';

const createUserProfile = async (userDetails: userObj) => {
  // console.log(userDetails);
  try {
    setDoc(doc(userProfileCollection, userDetails.id), userDetails);
  } catch (error: any) {
    console.log(error.message);
  }
};

const updateUserName = async (userId: string, newName: string) => {
  const docRef = doc(userProfileCollection, userId);
  await updateDoc(docRef, {
    name: newName,
  });
};
const updateUserEmail = async (userId: string, newEmail: string) => {
  const docRef = doc(userProfileCollection, userId);
  await updateDoc(docRef, {
    email: newEmail,
  });
};
const updateUserPhoto = async (userId: string, newPhotoURL: string) => {
  const docRef = doc(userProfileCollection, userId);
  await updateDoc(docRef, {
    photo: newPhotoURL,
  });
};

export { createUserProfile, updateUserName, updateUserEmail, updateUserPhoto };
