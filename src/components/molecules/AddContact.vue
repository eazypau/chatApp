<template>
  <div
    class="
      absolute
      z-10
      inset-0
      w-screen
      h-screen
      flex
      items-center
      justify-center
      bg-slate-500 bg-opacity-40
    "
  >
    <div class="bg-white border rounded-md overflow-hidden relative p-2">
      <button class="absolute right-2 top-1 p-1" @click="$emit('closeContact')">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="pl-1 font-semibold text-lg">
        <p>Add Contact</p>
      </div>
      <div class="p-1 flex justify-between">
        <input
          id="email"
          v-model="userEmail"
          type="text"
          name="email"
          class="border rounded h-8 w-60 pl-2"
        />
        <button class="pl-2" @click="addContacts">
          <i class="bi bi-plus-square text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { ref } from "@vue/reactivity";
  import { useStore } from "../../store/store";

  export default defineComponent({
    name: "AddContact",
    setup() {
      let userEmail = ref("");
      const store = useStore();

      const addContacts = async () => {
        if (userEmail.value === "") {
          return;
        }
        await store.addUserContact(userEmail.value);
        userEmail.value = "";
      };
      return { userEmail, store, addContacts };
    },
  });
</script>
