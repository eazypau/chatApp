<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <div class="w-full p-6 max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div>
        <h2 class="text-3xl font-bold text-center text-gray-700">EazyChat</h2>
        <p class="mt-1 text-center text-gray-500">Reset Password</p>
        <form class="mt-4">
          <TextInput
            name="Email"
            input-name="email"
            :value="email"
            @update:model-value="email = $event"
          />
        </form>
      </div>
      <div class="flex items-center justify-center mt-5 mb-2">
        <button class="authBtn" type="button">Request New Password</button>
      </div>
      <div class="mt-5 mb-3 text-sm font-light text-center text-gray-400">
        Have an account?
        <router-link to="/login" class="authRouterLink">Login here</router-link>
      </div>
      <div class="mt-1 text-sm font-light text-center text-gray-400">
        Don't have an account?
        <router-link to="/register" class="authRouterLink">Register here</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "@vue/reactivity";
  import TextInput from "../components/molecules/TextInput.vue";
  import { sendNewPassWord } from "../firebase/auth";

  let email = ref("");

  const getNewPassword = () => {
    // console.log('getting new password...');
    sendNewPassWord(email.value);
  };
</script>
