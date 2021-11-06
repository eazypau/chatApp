import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from '@firebase/auth';
import router from '../router';
import { auth } from './firebase';

const signInExistingUser = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred;
      router.push({ name: 'Home' });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const logOutUser = () => {
  signOut(auth)
    .then(() => {
      //   console.log('Successfully signed out...');
      router.push({ name: 'Login' });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createUserAcc = (email: string, password: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred;
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const sendNewPassWord = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log('Successfully send password');
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export { signInExistingUser, logOutUser, createUserAcc, sendNewPassWord };
