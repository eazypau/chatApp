<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <NotificationVue v-if="isShown" :error-msg="modalMsg" />
    <div class="w-full max-w-sm p-6 m-auto bg-white rounded-md shadow-md">
      <h1 class="text-3xl font-bold text-center text-gray-700">EazyChat</h1>

      <form class="mt-6" action="#" method="POST" @submit.prevent="login">
        <div>
          <label for="username" class="block text-base text-gray-800 font-medium pl-1 mb-1"
            >Username</label
          >
          <TextInput
            type="email"
            name="Email"
            input-name="email"
            required
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
          <button type="submit" class="authBtn">
            <span v-if="!loading">Login</span><span v-else class="animation-pulse">Loading...</span>
          </button>
        </div>
      </form>

      <p class="mt-8 text-xs font-light text-center text-gray-400">
        Don't have an account?
        <router-link to="/register" class="authRouterLink">Create One</router-link>
      </p>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "@vue/reactivity";
  import TextInput from "../components/molecules/TextInput.vue";
  import PwInput from "../components/molecules/PwInput.vue";
  import NotificationVue from "../components/molecules/Notification.vue";
  import useNotification from "../composable/useNotification";
  import { signInExistingUser } from "../firebase/auth";
  // import { signInWithGoogle } from "../firebase/authGoogle";
  import { useRouter } from "vue-router";

  let email = ref("");
  let password = ref("");
  let loading = ref(false);
  const router = useRouter();
  const { isShown, modalMsg } = useNotification();

  const login = () => {
    // console.log('login');
    loading.value = true;
    signInExistingUser(email.value, password.value);
    loading.value = false
    // router.push("/");
  };

  // const loginUsingGoogleAcc = () => {
  //   loading.value = true;
  //   signInWithGoogle();
  // };
</script>
