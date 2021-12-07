<template>
  <div class="w-full max-w-sm p-6 m-auto bg-white rounded-md shadow-md">
    <!-- <h1 class="text-3xl font-semibold text-center text-gray-700">EazyChat</h1>

    <form class="mt-6">
      <div>
        <label for="username" class="block text-sm text-gray-800 mb-3">Username</label>
        <TextInput
          name="Email"
          input-name="email"
          :value="email"
          @update:model-value="email = $event"
        />
      </div>
      <div class="mt-4">
        <div class="flex items-center justify-between">
          <label for="password" class="block text-sm text-gray-800">Password</label>
          <router-link to="/forgot-password" class="text-xs text-gray-600 hover:underline"
            >Forget Password?</router-link
          >
        </div>
        <PwInput
          name="Password"
          input-name="pasword"
          :value="password"
          class="mt-3"
          @update:model-value="password = $event"
          @keydown.enter="login"
        />
      </div>

      <div class="mt-6">
        <button
          class="
            w-full
            px-4
            py-2
            tracking-wide
            text-white
            transition-colors
            duration-200
            transform
            bg-gray-700
            rounded-md
            hover:bg-gray-600
            focus:outline-none focus:bg-gray-600
          "
          @click="login"
        >
          Login
        </button>
      </div>
    </form>

    <div class="flex items-center justify-between mt-4">
      <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
      <a href="#" class="text-xs text-center text-gray-500 uppercase hover:underline"
        >or login with Social Media</a
      >
      <span class="w-1/5 border-b lg:w-1/5"></span>
    </div>

    <div class="flex items-center mt-6 -mx-2">
      <button
        type="button"
        class="
          flex
          items-center
          justify-center
          w-full
          px-6
          py-2
          mx-2
          text-sm
          font-medium
          text-white
          transition-colors
          duration-200
          transform
          bg-blue-500
          rounded-md
          hover:bg-blue-400
          focus:bg-blue-400 focus:outline-none
        "
      >
        <svg class="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
          <path
            d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
          ></path>
        </svg>
        <span class="hidden mx-2 sm:inline">Sign in with Google</span>
      </button>
    </div>

    <p class="mt-8 text-xs font-light text-center text-gray-400">
      Don't have an account?
      <router-link to="/register" class="font-medium text-gray-700 hover:underline"
        >Create One</router-link
      >
    </p> -->
  </div>
</template>
<script setup lang="ts">
  import { addDoc, arrayUnion, doc, serverTimestamp, setDoc, updateDoc } from "@firebase/firestore";
  import { chatCollection, db, getCurrentUser, userProfileCollection } from "../firebase/firebase";
  import Notification from "../components/molecules/Notification.vue";
  import { ref } from "@vue/reactivity";
  import { Message } from "../classes/constructor";
  import TextInput from "../components/molecules/TextInput.vue";
  import PwInput from "../components/molecules/PwInput.vue";

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
    // console.log(testting);
  };
</script>
<style>
  .viewHeight {
    height: 93vh;
  }
</style>
