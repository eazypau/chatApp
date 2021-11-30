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
        <div v-if="!showProfile" class="flex items-center justify-between py-2 px-4 bg-gray-300">
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
            v-for="chatName in chatList"
            :key="chatName.chatId"
            :item="chatName"
            @passId="viewChat"
          />
        </div>
      </div>
      <div class="w-px bg-black"></div>
      <div class="w-9/12 flex">
        <!-- right panel -->
        <div class="flex flex-col h-full flex-1">
          <div class="h-14 flex items-center justify-between py-2 px-4 bg-gray-300">
            <!-- right header -->
            <div class="flex items-center">
              <img
                v-if="currentChatName !== ''"
                class="h-10 rounded-full"
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
            <div class="px-4 pt-2">
              <!-- messages -->
              <ChatBallon v-for="item in listOfChatContent" :key="item" :message="item" />
            </div>
            <div
              v-if="currentChatName !== ''"
              class="w-full flex items-center justify-between py-3 px-5 bg-gray-300"
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
  import { computed, ref } from "@vue/reactivity";
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

  const router = useRouter();
  const store = useStore();
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
  const profileDoc = computed(() => {
    return store.getProfile;
  });
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

  console.log(chatList.value, profileDoc.value, contactList.value);
  
  let currentChatName = ref("");
  let currentChatId = ref("");
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
    console.log(chatDocInfo);
    // store.createChat(chatDocInfo);
    currentPhoto.value = contactDoc.photo;
    currentChatName.value = contactDoc.name;
    showContact.value = false;
  };
  const viewChat = async (chatId: string, chatName: string) => {
    currentChatId.value = chatId;
    // const filterName = chatName.filter((item: string) => {
    //   return item !== store.getProfile.id;
    // });
    // // console.log(filterName);
    // const fetchingUser: any = await store.fetchOtherUserDetails(filterName[0]);
    currentChatName.value = chatName;
    await store.fetchCurrentChat(chatId);
  };
  const deleteChatHistory = () => {
    console.log("delete chat history...");
  };
  const sendMessage = async () => {
    const newMessageObj = {
      senderName: profileDoc.value.name,
      text: newMessage.value,
      senderId: profileDoc.value.id,
      chatId: currentChatId.value,
    };
    console.log(newMessageObj);
    await store.sendMessage(newMessageObj);
    newMessage.value = "";
  };

  //! target to get everything done by 7th Nov
  // TODO: create chat ballons, chat pills, modal and dropdown components
  // TODO: create the chat window at home page
  // TODO: use which version of firebase? v8 or v9?
  // TODO: implement firebase into the project
  // TODO: implement firebase auth (createUser, login, logout and send new password)
  // TODO: implement firebase store (create/delete profile, save/read/delete contact, save/read/delete chat history)
  // TODO: implement firebase storage (save/read/delete profile image)
  // TODO: add meta tags for SEO purposes
  // TODO: touch up on the colors
  // set favicon
  // dynamic routing
  // error page
</script>
<style>
  .viewHeight {
    height: 97vh;
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
