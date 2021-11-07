import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
} from "@firebase/auth";
import router from "../router";
import { auth } from "./firebase";
import { createUserProfile } from "./profile";

const signInExistingUser = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred;
      router.push({ name: "Home" });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const logOutUser = () => {
  signOut(auth)
    .then(() => {
      router.push({ name: "Login" });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const createUserAcc = (email: string, password: string, name: string) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const userId = userCred.uid;
      const userProfile = {
        id: userId,
        name: name,
        email: email,
        photo: "",
      };
      createUserProfile(userProfile);
    })
    .catch((err) => {
      console.log(err.message);
    });
};

const sendNewPassWord = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      console.log("Successfully send password");
    })
    .catch((err) => {
      console.log(err.message);
    });
};

export { signInExistingUser, logOutUser, createUserAcc, sendNewPassWord };
