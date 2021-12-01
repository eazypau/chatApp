<template>
  <div class="flex viewHeight">
    <div class="px-20 py-6">
      <Notification v-if="showNotification" :error-msg="errorMsg" />
      <h1>test using array union</h1>
      <button @click="showErrorMessage" class="border py-1 px-3 bg-sky-400">show Error</button>
      <button @click="testingConstructor" class="border py-1 px-3 bg-sky-400">Click to add doc</button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { addDoc, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "@firebase/firestore";
  import { chatCollection, db, getCurrentUser, userProfileCollection } from "../firebase/firebase";
  import Notification from "../components/molecules/Notification.vue";
  import { ref } from "@vue/reactivity";
  import { Message } from "../classes/constructor";

  let errorMsg = ref("");
  let showNotification = ref(false);

  //! serverTimeStamp doesnt work in arrays
  const createDummyDoc = async () => {
    await setDoc(doc(db, "dummy", "dummy2"), {
      name: "something",
      id: "dummy",
      messages: [
        {
          timestamp: Date(),
          content: "Hey there!",
        },
      ],
    });
    alert("successfully create dummy doc...");
  };

  const addElementIntoDocArray = async () => {
    await updateDoc(doc(db, "dummy", "dummy"), {
      messages: arrayUnion({
        timestamp: Date(),
        content: "it works with timestamp!",
      }),
    });
  };

  const showErrorMessage = () => {
    errorMsg.value = "message is shown";
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 2000);
  };

  const createChat = async () => {
    const chatDoc = {
      members: ["wcWpBlusTXPqsN8AitgVCVnqUNj1", "rCpkBvGWhWRI5Bvi4EipOZ1LFEk1"],
      createdBy: "wcWpBlusTXPqsN8AitgVCVnqUNj1",
      type: "private",
    };
    // const chatCollection = collection(db, "chats");
    const createChatDoc: any = await addDoc(chatCollection, {
      members: chatDoc.members,
      recentMessage: {
        messageText: "",
        sendBy: "",
        sentAt: "",
        senderName: "",
      },
      createdAt: serverTimestamp(),
      createdBy: chatDoc.createdBy,
      type: chatDoc.type,
    });
    const docRef = doc(userProfileCollection, "wcWpBlusTXPqsN8AitgVCVnqUNj1");
    await updateDoc(doc(chatCollection, createChatDoc.id), {
      id: createChatDoc.id,
    });
    // add chat id into current user
    await updateDoc(docRef, {
      chatGroupIds: arrayUnion(createChatDoc.id),
    });
    // add the chat id into the other user doc
    await updateDoc(doc(db, "userCollection", chatDoc.members[1]), {
      chatGroupIds: arrayUnion(createChatDoc.id),
    });
  };

  const testingConstructor = () => {
    const testting = new Message("Norman", "some text", "some id", "chat id");
    console.log(testting);
  };
</script>
<style>
  .viewHeight {
    height: 93vh;
  }
</style>
