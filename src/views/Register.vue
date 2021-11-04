<template>
  <div class="py-20">
    <div
      class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800"
    >
      <div class="px-6 py-4">
        <h2 class="text-3xl font-bold text-center text-gray-700 dark:text-white">Chatty App</h2>
        <p class="mt-1 text-center text-gray-500 dark:text-gray-400">Register</p>
        <form>
          <TextInput
            name="Name"
            inputName="name"
            :value="name"
            @update:model-value="name = $event"
          />
          <TextInput
            name="Email"
            inputName="email"
            :value="email"
            @update:model-value="email = $event"
          />
          <PwInput
            name="Password"
            inputName="pasword"
            :value="password"
            @update:model-value="password = $event"
            @keydown.enter="createUser"
          />
          <div class="flex items-center justify-center mt-4">
            <button class="authBtn" type="button" @click="createUser">Register</button>
          </div>
        </form>
      </div>
      <div class="flex items-center justify-center py-4 text-center bg-gray-50 dark:bg-gray-700">
        <span class="text-sm text-gray-600 dark:text-gray-200">Have an account? </span>
        <router-link to="/login" class="authRouterLink">Login here</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "@vue/reactivity";
  import TextInput from "../components/molecules/TextInput.vue";
  import PwInput from "../components/molecules/PwInput.vue";

  let name = ref("");
  let email = ref("");
  let password = ref("");
  const createUser = () => {
    console.log("create");
  };
</script>
