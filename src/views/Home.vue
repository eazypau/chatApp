<template>
  <div>
    <NavigationBar />
    <div class="flex viewHeight">
      <transition name="addContactAnimate">
        <ContactList
          :contacts="contactList"
          @close-contact="showContact = false"
          @createChat="createChatWindow"
          v-if="showContact"
        />
      </transition>
      <transition name="addContactAnimate">
        <AddContact @close-contact="showAddContact = false" v-if="showAddContact" />
      </transition>
      <div class="w-3/12 flex flex-col">
        <!-- left panel -->
        <Profile
          v-if="showProfile"
          @closeProfile="showProfile = false"
          class="w-full"
          :profileImg="profilePic"
          :userEmail="profileDoc.email"
          :userName="profileDoc.name"
        />
        <div
          v-if="!showProfile"
          class="flex items-center justify-between navigationHeight py-2 px-4 bg-gray-300"
        >
          <!-- left header -->
          <img
            class="h-10 rounded-full"
            src="https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg"
            alt=""
          />
          <DropDown
            @open-add-contact-window="showAddContact = true"
            @open-contact-window="showContact = true"
            @open-profile="showProfile = true"
          />
        </div>
        <div v-if="!showProfile" class="bg-gray-100 flex-1">
          <!-- body -->
          <ChatContact
            v-for="(chatName, index) in chatList"
            :key="index"
            :item="chatName"
            @passId="viewChat"
          />
        </div>
      </div>
      <div class="w-px bg-black"></div>
      <div class="w-9/12 flex">
        <!-- right panel -->
        <div class="flex flex-col h-full flex-1">
          <div class="navigationHeight flex items-center justify-between py-2 px-4 bg-gray-300">
            <!-- right header -->
            <div class="flex items-center">
              <img
                v-if="currentChatName !== ''"
                class="w-10 h-10 rounded-full"
                :src="
                  currentPhoto === ''
                    ? 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
                    : currentPhoto
                "
              />
              <p class="px-3">{{ currentChatName }}</p>
            </div>
            <ChatDropDown
              v-if="currentChatName !== ''"
              @view-contact-details="showOtherProfile = true"
              @delete-chat="deleteChatHistory"
            />
          </div>
          <div class="bg-gray-100 flex-1 flex flex-col justify-between">
            <!-- body -->
            <div id="container" class="px-4 pt-2 bodyHeight overflow-y-scroll">
              <!-- messages -->
              <ChatBallon v-for="(item, index) in listOfChatContent" :key="index" :message="item" />
              <span id="dummy"></span>
            </div>
            <div
              v-if="currentChatName !== ''"
              class="w-full inputBarHeight flex items-center justify-between py-3 px-5 bg-gray-300"
            >
              <input
                type="text"
                name="newMsg"
                id="newMsg"
                v-model="newMessage"
                class="rounded-full flex-1 h-8 px-4"
                @keydown.enter="sendMessage"
              />
              <button type="button" @click="sendMessage">
                <i class="bi bi-arrow-right-circle text-xl pl-3"></i>
              </button>
            </div>
          </div>
        </div>
        <Profile
          v-if="showOtherProfile"
          @closeProfile="showOtherProfile = false"
          class="absolute inset-0 w-4/12"
        />
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useStore } from "../store/store";
  // import useDummy from "../composable/useDummy";
  import { computed, ref, toRef, toRefs } from "@vue/reactivity";
  import ChatContact from "../components/organisms/ChatContact.vue";
  import ChatBallon from "../components/molecules/ChatBallon.vue";
  import DropDown from "../components/organisms/DropDown.vue";
  import ChatDropDown from "../components/organisms/ChatDropDown.vue";
  import Profile from "../components/organisms/Profile.vue";
  import ContactList from "../components/organisms/ContactList.vue";
  import AddContact from "../components/molecules/AddContact.vue";
  import { onAuthStateChanged } from "@firebase/auth";
  import { auth } from "../firebase/firebase";
  import NavigationBar from "../components/organisms/NavigationBar.vue";
  import { contactsObj } from "../classes/type";
  import { useRouter } from "vue-router";
  import { Message } from "../classes/constructor";
  import { watch } from "@vue/runtime-core";
  import useDOM from "../composable/useDOM";

  const router = useRouter();
  const store = useStore();
  const { slideDown } = useDOM();
  // const { chatContent } = useDummy();
  onAuthStateChanged(auth, async (user: any) => {
    if (user) {
      // console.log(user);
      store.user = user.uid;
      await store.fetchUserProfile();
      await store.fetchContactList();
      await store.fetchChatList();
    } else {
      router.push("/login");
    }
  });
  // await store.fetchUserProfile();
  // await store.fetchContactList();
  // await store.fetchChatList();

  const chatList = computed(() => store.getChatList);
  const listOfChatContent = computed(() => {
    if (store.getChatContent === []) {
      return [];
    }
    return store.getChatContent;
  });
  const profileDoc = computed(() => store.getProfile);
  const profilePic = computed(() => {
    if (store.getProfile.photo === "") {
      return "https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg";
    }
    return store.getProfile.photo;
  });
  const contactList = computed(() => {
    if (store.getContactList.length === 0) {
      return [];
    }
    return store.getContactList;
  });

  watch(
    () => listOfChatContent.value,
    (prev, next) => {
      slideDown("dummy");
      // const container = document.getElementById("dummy");
      // container.scrollTo = container.scrollHeight;
    },
    { deep: true }
  );

  let currentChatName = ref("");
  // let currentChatId = ref("");
  const currentChatId = computed(() => store.getCurrentChatId);
  let currentPhoto = ref("");
  let newMessage = ref("");
  let showProfile = ref(false);
  let showOtherProfile = ref(false);
  let showContact = ref(false);
  let showAddContact = ref(false);
  // let currentUserName = ref("");

  const createChatWindow = (contactDoc: contactsObj) => {
    const chatDocInfo = {
      members: [profileDoc.value.id, contactDoc.id],
      createdBy: profileDoc.value.id,
      type: "private",
    };
    // console.log(chatDocInfo);
    store.currentChatInfo = chatDocInfo;
    currentPhoto.value = contactDoc.photo;
    currentChatName.value = contactDoc.name;
    showContact.value = false;
  };
  //TODO: need to implement autoScroll to bottom when view chat
  const viewChat = async (chatId: string, chatName: string, chatPhoto: string) => {
    const container: any = document.getElementById("dummy");
    // currentChatId.value = chatId;
    store.currentChatId = chatId;
    currentChatName.value = chatName;
    currentPhoto.value = chatPhoto;
    await store.fetchCurrentChat(chatId);
    // container.scrollIntoView({ behavior: "smooth" });
    container.scrollTo = container.scrollHeight;
  };
  const deleteChatHistory = () => {
    console.log("delete chat history...");
  };
  const sendMessage = async () => {
    const newMessageContent = new Message(
      profileDoc.value.name,
      newMessage.value,
      profileDoc.value.id,
      currentChatId.value
    );
    console.log(newMessageContent);
    await store.sendMessage(newMessageContent);
    newMessage.value = "";
    // const container = document.getElementById("container");
    // container.scrollIntoView({ behavior: "smooth" });
    // container.scrollTop = container.scrollHeight;
    const container: any = document.getElementById("dummy");
    container.scrollIntoView({ behavior: "smooth" });
  };

  //! target to get everything done by 4th Dec
  //// create chat ballons, chat pills, modal and dropdown components
  //// create the chat window at home page
  //// use which version of firebase? v8 or v9?
  //// implement firebase into the project
  // TODO: implement firebase auth (createUser, login, logout and send new password)
  // TODO: implement firebase store (create/delete profile, save/read/delete contact, save/read/delete chat history)
  // TODO: implement firebase storage (save/read/delete profile image)
  //// add meta tags for SEO purposes
  // TODO: update favicon and add a loading component
  // TODO: touch up on the colors
  // TODO: resolve all ts errors...
  // TODO: update README.md
  // dynamic routing
  // error page
</script>
<style>
  .viewHeight {
    height: 97vh;
  }
  .navigationHeight,
  .inputBarHeight {
    height: 6vh;
  }
  .bodyHeight {
    height: 85vh;
  }
  .addContactAnimate-enter-active,
  .addContactAnimate-leave-active {
    transition: opacity 0.4s ease;
  }
  .addContactAnimate-enter-from,
  .addContactAnimate-leave-to {
    opacity: 0;
  }
</style>
