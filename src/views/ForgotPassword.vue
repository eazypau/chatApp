<template>
  <div class="py-20">
    <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-3xl font-bold text-center text-gray-700">Chatty App</h2>
        <p class="mt-1 text-center text-gray-500">Request New Password</p>
        <form>
          <TextInput
            name="Email"
            inputName="email"
            :value="email"
            @update:model-value="email = $event"
          />
        </form>
      </div>
      <div class="flex items-center justify-center my-4">
        <button class="authBtn" type="button">Request</button>
      </div>
      <div class="flex items-center justify-center pt-4 text-center bg-gray-50">
        <span class="text-sm text-gray-600">Have an account? </span>
        <router-link to="/login" class="authRouterLink">Login here</router-link>
      </div>
      <div class="flex items-center justify-center pb-4 pt-2 text-center bg-sky-50">
        <span class="text-sm text-gray-600">Don't have an account? </span>
        <router-link to="/register" class="authRouterLink">Register here</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import TextInput from '../components/molecules/TextInput.vue';
  import { sendNewPassWord } from '../firebase/auth';

  let email = ref('');

  const getNewPassword = () => {
    console.log('getting new password...');
    sendNewPassWord(email.value);
  };
</script>
