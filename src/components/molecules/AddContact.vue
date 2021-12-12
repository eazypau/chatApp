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
      bg-slate-200 bg-opacity-40
    "
  >
    <div class="bg-white rounded-md shadow-xl overflow-hidden relative p-5">
      <button class="absolute right-2 top-1 p-1 hover:text-red-600" @click="$emit('closeContact')">
        <i class="bi bi-x-lg text-xl"></i>
      </button>
      <div class="pl-1 font-bold text-xl">
        <p>Add Contact</p>
      </div>
      <div class="mt-2 flex justify-between border-2 rounded-md">
        <input
          id="email"
          v-model="userEmail"
          type="text"
          name="email"
          class="w-60 pl-2"
        />
        <button class="py-1 px-2 border-l-2 hover:bg-gray-200" @click="addContacts">
          <i class="bi bi-plus text-xl font-bold"></i>
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
      // let name = ref("");
      const store = useStore();
      const addContacts = async () => {
        if (userEmail.value === "") {
          return;
        }
        await store.addUserContact(userEmail.value);
        userEmail.value = "";
        // name.value = "";
      };
      return { userEmail, store, addContacts };
    },
  });
</script>
