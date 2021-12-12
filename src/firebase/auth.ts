import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
} from "@firebase/auth";
import { async } from "@firebase/util";
import useNotification from "../composable/useNotification";
// import { Profile } from "../classes/constructor";
import router from "../router";
import { auth } from "./firebase";
import { createUserProfile } from "./profile";

const { triggerMessage } = useNotification();

const signInExistingUser = (email: string, password: string) => {
  signInWithEmailAndPassword(auth, email, password)
    .then((userCred) => {
      const user = userCred.user;
      // store.user = user.uid;
      localStorage.setItem("firebaseToken", user.uid);
      return router.push({ name: "Home" });
    })
    .catch((err) => {
      triggerMessage(err.message);
    });
};

const logOutUser = () => {
  signOut(auth)
    .then(() => {
      localStorage.removeItem("firebaseToken");
      return router.push({ name: "Login" });
    })
    .catch((err) => {
      triggerMessage(err.message);
    });
};

const createUserAcc = (userDetails: { email: string; password: string; name: string }) => {
  createUserWithEmailAndPassword(auth, userDetails.email, userDetails.password)
    .then(async (userCred) => {
      const user = userCred.user;
      // console.log(user.uid);
      const userProfile = {
        id: user.uid,
        name: userDetails.name,
        email: userDetails.email,
        photo: "",
        chatGroupIds: [],
        contacts: [],
      };
      localStorage.setItem("firebaseToken", user.uid);
      // store.user = user.uid;
      // const userProfile = new Profile(user.uid, userDetails.name, userDetails.email, "", []);
      await createUserProfile(userProfile);
      router.push({ name: "Home" });
    })
    .catch((err) => {
      triggerMessage(err.message);
    });
};

const sendNewPassWord = (email: string) => {
  sendPasswordResetEmail(auth, email)
    .then(() => {
      triggerMessage("Successfully send password");
    })
    .catch((err) => {
      triggerMessage(err.message);
    });
};

const updateUserAccEmail = (email: string) => {
  const user: any = auth.currentUser;
  updateEmail(user, email)
    .then(() => {
      // triggerMessage("Successfully update email address");
    })
    .catch((err) => {
      triggerMessage(err.message);
    });
};

export { signInExistingUser, logOutUser, createUserAcc, sendNewPassWord, updateUserAccEmail };
