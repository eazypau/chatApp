<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-3xl font-bold text-center text-gray-700">EazyChat</h2>
        <h3 class="mt-1 text-xl font-medium text-center text-gray-600">Welcome Back</h3>
        <p class="mt-1 text-center text-gray-500">Login</p>
        <form class="mt-3">
          <TextInput
            name="Email"
            input-name="email"
            :value="email"
            @update:model-value="email = $event"
          />
          <PwInput
            name="Password"
            input-name="pasword"
            :value="password"
            class="mt-3"
            @update:model-value="password = $event"
            @keydown.enter="login"
          />
          <div class="flex items-center justify-between mt-4">
            <router-link to="/forgot-password" class="text-sm text-gray-600 hover:text-gray-500"
              >Forget Password?</router-link
            >
            <button class="authBtn" type="button" @click="login">Login</button>
          </div>
        </form>
      </div>
      <div class="flex items-center justify-center py-4 text-center bg-gray-700">
        <span class="text-sm text-white">Don't have an account? </span>
        <router-link to="/register" class="authRouterLink">Register</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import TextInput from '../components/molecules/TextInput.vue';
  import PwInput from '../components/molecules/PwInput.vue';
  import { signInExistingUser } from '../firebase/auth';

  let email = ref('');
  let password = ref('');

  const login = () => {
    // console.log('login');
    signInExistingUser(email.value, password.value);
  };
</script>
