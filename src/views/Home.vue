<template>
  <div class="flex viewHeight">
    <div class="w-3/12 flex flex-col">
      <!-- left panel -->
      <div class="flex items-center justify-between py-2 px-4 bg-gray-300">
        <!-- left header -->
        <img
          class="h-10 rounded-full"
          src="https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg"
          alt=""
        />
        <DropDown
          @open-add-contact-window="openAddContact"
          @open-contact-window="openContactList"
        />
      </div>
      <div class="bg-gray-100 flex-1">
        <!-- body -->
        <ChatContact
          v-for="chatName in list"
          :key="chatName.chatId"
          :item="chatName"
          @passId="storeChatId"
        />
      </div>
    </div>
    <div class="w-px bg-black"></div>
    <div class="w-9/12 flex flex-col">
      <!-- right panel -->
      <div class="flex items-center justify-between py-2 px-4 bg-gray-300">
        <!-- right header -->
        <div class="flex items-center">
          <img
            class="h-10 rounded-full"
            src="https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg"
          />
          <p class="px-3">name</p>
        </div>
        <ChatDropDown
          @view-contact-details="viewOtherContactDetails"
          @delete-chat="deleteChatHistory"
        />
      </div>
      <div class="bg-gray-100 flex-1 flex flex-col justify-between">
        <!-- body -->
        <div class="px-4 pt-2">
          <!-- messages -->
          <ChatBallon v-for="item in listOfChatContent" :key="item.id" :messageList="item" />
        </div>
        <div class="w-full flex items-center justify-between py-2 px-4 bg-gray-300">
          <input
            type="text"
            name="newMsg"
            id="newMsg"
            v-model="newMessage"
            class="rounded-full flex-1 h-8 px-4"
            @keydown.enter="sendMessage"
          />
          <button type="button" @click="sendMessage">
            <i class="bi bi-arrow-right-circle text-xl px-3"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { useStore } from "../store/store";
  import useDummy from "../composable/useDummy";
  import { computed, ref } from "@vue/reactivity";
  import ChatContact from "../components/organisms/ChatContact.vue";
  import ChatBallon from "../components/molecules/ChatBallon.vue";
  import DropDown from "../components/organisms/DropDown.vue";
  import ChatDropDown from "../components/organisms/ChatDropDown.vue";

  const { chatList, chatContent } = useDummy();
  const list = computed(() => chatList);
  const listOfChatContent = computed(() => {
    if (currentChatId.value === "") {
      return [];
    }
    return chatContent.filter((item: any) => {
      return item.id === currentChatId.value;
    });
  });
  const store = useStore();
  let currentChatId = ref("");
  let newMessage = ref("");
  // let currentUserName = ref("");

  const storeChatId = (chatId: string) => {
    currentChatId.value = chatId;
  };
  const openAddContact = () => {
    console.log("open add contact...");
  };
  const openContactList = () => {
    console.log("open contact list...");
  };
  const viewOtherContactDetails = () => {
    console.log("view other user contact details...");
  };
  const deleteChatHistory = () => {
    console.log("delete chat history...");
  };
  const sendMessage = () => {
    const newMessageObj = {
      name: "Mona",
      message: newMessage.value,
      timeStamp: Date(),
    };
    for (let i = 0; i < chatContent.length; i++) {
      const id = chatContent[i].id;
      if (id === currentChatId.value) {
        chatContent[i].messages.push(newMessageObj);
        console.log(chatContent[i]);
        break;
      }
    }
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
  // set favicon
  // dynamic routing
  // error page
</script>
<style>
  .viewHeight {
    height: 93vh;
  }
</style>
