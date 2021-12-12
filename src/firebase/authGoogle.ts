import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { userObj } from "../classes/type";
import useNotification from "../composable/useNotification";
import router from "../router";
import { auth, userProfileCollection } from "./firebase";
import { createUserProfile } from "./profile";

const provider = new GoogleAuthProvider();

const { triggerMessage } = useNotification();

const signInWithGoogle = () => {
  signInWithPopup(auth, provider)
    .then(async (result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential: any = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user: any = result.user;
      //   console.log(user);
      // check whether profile exist
      const checkProfileCollection = await getDoc(doc(userProfileCollection, user.uid));
      if (checkProfileCollection.exists()) {
        router.push({ name: "Home" });
      } else {
        // if doesn't exist, create a new profile doc
        const userProfile: userObj = {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          photo: user.photoURL,
          chatGroupIds: [],
          contacts: [],
        };
        await createUserProfile(userProfile);
        router.push({ name: "Home" });
      }
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      triggerMessage(errorMessage);
    });
};

export { signInWithGoogle };
