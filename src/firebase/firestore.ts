import { doc, setDoc } from "@firebase/firestore";
import { Profile } from "../classes/constructor";
import { user } from "../classes/type";
import { db } from "./firebase";

const createUserProfile = async (userDetails: user) => {
  const uid = userDetails.id;
  const name = userDetails.name;
  const email = userDetails.email;
  const photo = userDetails.photo;
  await setDoc(doc(db, "userCollection", uid), new Profile(uid, name, email, photo));
};
