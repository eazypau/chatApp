<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <div class="w-full p-6 max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <form action="#" method="POST" @submit.prevent="getNewPassword">
        <div>
          <h2 class="text-3xl font-bold text-center text-gray-700">EazyChat</h2>
          <p class="mt-1 text-center text-gray-500">Reset Password</p>
          <div class="mt-4">
            <TextInput
              type="email"
              name="Email"
              input-name="email"
              required
              :value="email"
              @update:model-value="email = $event"
            />
          </div>
        </div>
        <div class="flex items-center justify-center mt-5 mb-2">
          <button class="authBtn" type="submit">
            <span v-if="!loading">Request New Password</span
            ><span v-else class="animation-pulse">Loading...</span>
          </button>
        </div>
      </form>
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
  let loading = ref(false);

  const getNewPassword = () => {
    // console.log('getting new password...');
    loading.value = true;
    sendNewPassWord(email.value);
    loading.value = false;
  };
</script>
