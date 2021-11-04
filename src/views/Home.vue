<template>
  <div>
    <p>Home</p>
    <p>{{ store.count }}</p>
    <button @click="increment" class="border p-2">Increment</button>
  </div>
</template>
<script setup lang="ts">
  import { useStore } from "../store/store";

  const store = useStore();

  const increment = () => {
    store.$patch((state) => {
      state.count++
    })
  }

  //! target to get everything done by 7th Nov
  // TODO: create chat ballons, chat pills, modal and dropdown components
  // TODO: create the chat window at home page
  // TODO: use which version of firebase? v8 or v9?
  // TODO: implement firebase into the project
  // TODO: implement firebase auth (createUser, login, logout and send new password)
  // TODO: implement firebase store (create/delete profile, save/read/delete contact, save/read/delete chat history)
  // TODO: implement firebase storage (save/read/delete profile image)
</script>
