import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from '@firebase/auth';
import router from '../router';
import { auth } from './firebase';
import { createUserProfile } from './profile';

const signInExistingUser = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred.user;
      // store.user = user.uid;
      return router.push({ name: 'Home' });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const logOutUser = () => {
  signOut(auth)
    .then(() => {
      return router.push({ name: 'Login' });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createUserAcc = (userDetails: { email: string; password: string; name: string }) => {
  createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
    .then(async (userCred) => {
      const user = userCred.user;
      console.log(user.uid);
      const userProfile = {
        id: user.uid,
        name: userDetails.name,
        email: userDetails.email,
        photo: '',
        chatGroupIds: []
      };
      // store.user = user.uid;
      await createUserProfile(userProfile);
      router.push({ name: 'Home' });
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

const updateUserAccEmail = (email: string) => {
  updateEmail(auth.currentUser, email)
    .then(() => {
      alert('Successfully update email address');
    })
    .catch((err) => {
      alert(`${err.message}`);
    });
};

export { signInExistingUser, logOutUser, createUserAcc, sendNewPassWord, updateUserAccEmail };
