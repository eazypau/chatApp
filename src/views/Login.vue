<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <div class="w-full max-w-sm p-6 m-auto bg-white rounded-md shadow-md">
      <h1 class="text-3xl font-bold text-center text-gray-700">EazyChat</h1>

      <form class="mt-6">
        <div>
          <label for="username" class="block text-base text-gray-800 font-medium pl-1 mb-1"
            >Username</label
          >
          <TextInput
            name="Email"
            input-name="email"
            :value="email"
            @update:model-value="email = $event"
          />
        </div>
        <div class="mt-3">
          <div class="flex items-center justify-between">
            <label for="password" class="block text-base text-gray-800 font-medium pl-1 mb-1"
              >Password</label
            >
            <router-link to="/forgot-password" class="text-xs text-gray-600 hover:underline"
              >Forget Password?</router-link
            >
          </div>
          <PwInput
            name="Password"
            input-name="pasword"
            :value="password"
            @update:model-value="password = $event"
            @keydown.enter="login"
          />
        </div>

        <div class="mt-6">
          <button type="button" class="authBtn" @click="login">
            <span v-if="!loading">Login</span><span v-else class="animation-pulse">Loading...</span>
          </button>
        </div>
      </form>

      <div class="flex items-center justify-between mt-4">
        <span class="w-1/5 border-b dark:border-gray-600 lg:w-1/5"></span>
        <a href="#" class="text-xs text-center text-gray-500 uppercase hover:underline"
          >or login with Social Media</a
        >
        <span class="w-1/5 border-b lg:w-1/5"></span>
      </div>

      <div class="flex items-center mt-6 -mx-2">
        <button
          type="button"
          class="
            flex
            items-center
            justify-center
            w-full
            px-6
            py-2
            mx-2
            text-sm
            font-medium
            text-white
            transition-colors
            duration-200
            transform
            bg-blue-500
            rounded-md
            hover:bg-blue-400
            focus:bg-blue-400 focus:outline-none
          "
        >
          <svg class="w-4 h-4 mx-2 fill-current" viewBox="0 0 24 24">
            <path
              d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            ></path>
          </svg>
          <span class="hidden mx-2 sm:inline">Sign in with Google</span>
        </button>
      </div>

      <p class="mt-8 text-xs font-light text-center text-gray-400">
        Don't have an account?
        <router-link to="/register" class="authRouterLink"
          >Create One</router-link
        >
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "@vue/reactivity";
  import TextInput from "../components/molecules/TextInput.vue";
  import PwInput from "../components/molecules/PwInput.vue";
  import { signInExistingUser } from "../firebase/auth";

  let email = ref("");
  let password = ref("");
  let loading = ref(false);

  const login = () => {
    // console.log('login');
    loading.value = true;
    signInExistingUser(email.value, password.value);
  };

  // TODO: add google login
</script>
