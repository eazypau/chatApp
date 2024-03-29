<template>
  <div>
    <NavigationBar />
    <NotificationVue v-if="isShown" :error-msg="modalMsg" />
    <div class="flex viewHeight">
      <ContactList
        :is-open="showContact"
        :contacts="contactList"
        @close-contact="showContact = false"
        @create-chat="createChatWindow"
      />
      <AddContact :is-open="showAddContact" @close-contact="showAddContact = false" />
      <div class="z-10 w-full md:w-4/12 lg:w-3/12 flex flex-col">
        <!-- left panel -->
        <Profile
          v-if="showProfile"
          :profile-img="profilePic"
          :user-email="profileDoc.email"
          :user-name="profileDoc.name"
          :is-user="profileDoc.id !== ''"
          class="w-full"
          @close-profile="showProfile = false"
        />
        <div
          v-if="!showProfile"
          class="flex items-center justify-between navigationHeight py-2 px-4 bg-dark-blue"
        >
          <!-- left header -->
          <img
            class="w-10 h-10 rounded-full object-cover object-center"
            :src="
              profileDoc.photo
                ? profileDoc.photo
                : 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
            "
            alt=""
          />
          <DropDown
            @open-add-contact-window="showAddContact = true"
            @open-contact-window="showContact = true"
            @open-profile="showProfile = true"
          />
        </div>
        <div v-if="!showProfile" class="bg-white flex-1 listOfChatHeight">
          <!-- body -->
          <ChatContact
            v-for="(chatName, index) in chatList"
            :key="index"
            :item="chatName"
            @pass-id="viewChat"
          />
        </div>
      </div>
      <div class="w-px bg-secondary-dark"></div>
      <div
        :class="[
          selectedAChat ? 'z-20' : 'z-0',
          'w-full md:w-8/12 lg:w-9/12 absolute md:flex md:relative',
        ]"
      >
        <!-- right panel -->
        <div class="flex flex-col h-full flex-1">
          <div class="navigationHeight flex items-center justify-between py-2 px-4 bg-dark-blue">
            <!-- right header -->
            <div class="flex items-center">
              <img
                v-if="currentChatName !== ''"
                class="w-10 h-10 rounded-full object-cover object-center"
                :src="
                  currentPhoto === ''
                    ? 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
                    : currentPhoto
                "
              />
              <p class="px-3 text-white font-medium">{{ currentChatName }}</p>
            </div>
            <ChatDropDown
              v-if="currentChatName !== ''"
              @view-contact-details="showOtherProfile = true"
              @quit-chat="minimizeChat"
            />
          </div>
          <div class="bg-light flex-1 flex flex-col justify-between">
            <!-- body -->
            <div
              id="container"
              :class="[
                store.currentChatContent.length === 0 ? '' : 'overflow-y-scroll',
                'px-4 pt-2 bodyHeight',
              ]"
            >
              <!-- messages -->
              <ChatBallon v-for="(item, index) in listOfChatContent" :key="index" :message="item" />
              <span id="dummy"></span>
            </div>
            <div
              v-if="currentChatName !== ''"
              class="w-full inputBarHeight flex items-center justify-between py-3 px-5 bg-dark-blue"
            >
              <input
                id="newMsg"
                v-model="newMessage"
                type="text"
                name="newMsg"
                class="rounded-full flex-1 h-8 px-4"
                @keydown.enter.prevent="sendMessage"
              />
              <button
                type="button"
                class="ml-3 bg-white hover:bg-gray-200 rounded-full"
                @click.prevent="sendMessage"
              >
                <i class="bi bi-arrow-right-short text-xl px-1"></i>
              </button>
            </div>
          </div>
        </div>
        <div
          v-if="showOtherProfile"
          class="absolute inset-y-0 right-0 z-10 w-full lg:relative lg:w-4/12 bg-white"
        >
          <Profile
            class=""
            :profile-img="otherUserProfilePic"
            :user-email="otherUserProfile.email"
            :user-name="otherUserProfile.name"
            @close-profile="showOtherProfile = false"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useStore } from "../store/store";
  import { computed, ref } from "@vue/reactivity";
  import ChatContact from "../components/organisms/ChatContact.vue";
  import ChatBallon from "../components/molecules/ChatBallon.vue";
  import DropDown from "../components/organisms/DropDown.vue";
  import ChatDropDown from "../components/organisms/ChatDropDown.vue";
  import Profile from "../components/organisms/Profile.vue";
  import ContactList from "../components/organisms/ContactList.vue";
  import AddContact from "../components/molecules/AddContact.vue";
  import NavigationBar from "../components/organisms/NavigationBar.vue";
  import { onAuthStateChanged } from "@firebase/auth";
  import { contactsObj } from "../classes/type";
  import { useRouter } from "vue-router";
  import { Message } from "../classes/constructor";
  import { watch } from "@vue/runtime-core";
  // import useDOM from "../composable/useDOM";
  import NotificationVue from "../components/molecules/Notification.vue";
  import useNotification from "../composable/useNotification";
  import { auth } from "../firebase/firebase";

  const router = useRouter();
  const store = useStore();
  // const { slideDown } = useDOM();
  const { isShown, modalMsg, triggerMessage } = useNotification();

  onAuthStateChanged(auth, async (user: any) => {
    if (user) {
      // console.log(user);
      store.user = user.uid;
    }
  });
  await store.fetchUserProfile();
  await store.fetchContactList();
  store.fetchChatList();

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
  const otherUserProfile = computed(() => store.getOtherUser);
  const otherUserProfilePic = computed(() => {
    if (store.getOtherUser.photo === "") {
      return "https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg";
    }
    return store.getProfile.photo;
  });

  watch(
    () => listOfChatContent.value,
    () => {
      if (store.currentChatContent !== []) {
        setTimeout(() => {
          // const div: any = document.getElementById("dummy");
          const div: any = document.getElementById("container");
          div.scrollTop = div.scrollHeight;
          // div.scrollIntoView({ behavior: "smooth" });
        }, 500);
      }
    },
    { deep: true }
  );

  watch(() => store.profile.chatGroupIds, () => { store.fetchChatList() })

  let currentChatName = ref("");
  const currentChatId = computed(() => store.getCurrentChatId);
  let currentPhoto = ref("");
  let newMessage = ref("");
  let showProfile = ref(false);
  let showOtherProfile = ref(false);
  let showContact = ref(false);
  let showAddContact = ref(false);
  let selectedAChat = ref(false);

  const minimizeChat = () => {
    // console.log("close chat");
    selectedAChat.value = false;
  };
  const createChatWindow = async (contactDoc: contactsObj) => {
    const container: HTMLDivElement | any = document.getElementById("container");
    const chatDocInfo = {
      members: [profileDoc.value.id, contactDoc.id],
      createdBy: profileDoc.value.id,
      type: "private",
    };
    store.currentChatInfo = chatDocInfo;
    currentPhoto.value = contactDoc.photo;
    currentChatName.value = contactDoc.name;
    showContact.value = false;
    store.currentChatId = "";
    store.currentChatContent = [];
    const findDoc: any = await store.fetchChatDocument(chatDocInfo.members);
    // console.log(findDoc);
    if (findDoc.length > 0) {
      await store.fetchCurrentChat(findDoc[0].id);
      store.currentChatId = findDoc[0].id;
    }
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 500);
    selectedAChat.value = true;
    // console.log(store.currentChatId);
    
  };
  //* reference https://newbedev.com/keep-overflow-div-scrolled-to-bottom-unless-user-scrolls-up
  const viewChat = async (chatDoc: any) => {
    const container: HTMLDivElement | any = document.getElementById("container");
    // currentChatId.value = chatId;
    store.currentChatId = chatDoc.id;
    currentChatName.value = chatDoc.name;
    currentPhoto.value = chatDoc.photo;
    const filteredId = chatDoc.members.filter((item: any) => {
      return item !== profileDoc.value.id;
    });
    await store.fetchCurrentChat(chatDoc.id);
    await store.fetchOtherUserDetails(filteredId[0]);
    container.scrollTop = container.scrollHeight;
    selectedAChat.value = true;
  };
  // const deleteChatHistory = () => {
  //   store.deleteChatDoc(currentChatId.value);
  //   currentChatName.value = "";
  // };
  const sendMessage = async () => {
    if (newMessage.value === "") {
      triggerMessage("Please enter a text");
      return;
    }
    const newMessageContent = new Message(
      profileDoc.value.name,
      newMessage.value,
      profileDoc.value.id,
      currentChatId.value
    );
    // console.log(newMessageContent);
    await store.sendMessage(newMessageContent);
    newMessage.value = "";
    const container: HTMLElement | any = document.getElementById("dummy");
    container.scrollIntoView({ behavior: "smooth" });
  };
</script>
<style scoped>
  /* scoped is to prevent the styling to be used globally */
  .viewHeight {
    height: 97vh;
  }
  .navigationHeight,
  .inputBarHeight {
    height: 7vh;
  }
  .listOfChatHeight {
    height: 89vh;
    overflow: auto;
  }
  .bodyHeight {
    height: 83vh;
  }
  @media (min-width: 768px) {
    .navigationHeight,
    .inputBarHeight {
      height: 6vh;
    }
    .bodyHeight {
      height: 85vh;
    }
    .listOfChatHeight {
      height: 91vh;
    }
  }
</style>
