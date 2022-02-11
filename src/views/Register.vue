<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <transition name="modal">
      <Notification v-if="isShown" :error-msg="modalMsg" />
    </transition>

    <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-3xl font-bold text-center text-gray-700">EazyChat</h2>
        <p class="mt-1 text-center text-gray-500">Register</p>
        <form class="mt-3" action="#" method="POST" @submit.prevent="createUser">
          <div>
            <label for="name" class="block text-base text-gray-800 font-medium pl-1 mb-1"
              >Name</label
            >
            <TextInput
              name="Name"
              input-name="name"
              required
              :value="name"
              @update:model-value="name = $event"
            />
          </div>
          <div class="mt-3">
            <label for="email" class="block text-base text-gray-800 font-medium pl-1 mb-1"
              >Email</label
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
            <label for="password" class="block text-base text-gray-800 font-medium pl-1 mb-1"
              >Password</label
            >
            <PwInput
              name="Password"
              input-name="pasword"
              :value="password"
              @update:model-value="password = $event"
            />
          </div>
          <div class="mt-3">
            <label for="confirmPassword" class="block text-base text-gray-800 font-medium pl-1 mb-1"
              >Confirm Password</label
            >
          </div>
          <PwInput
            name="ConfirmPassword"
            input-name="confirmPassword"
            :value="confirmPassword"
            @update:model-value="confirmPassword = $event"
            @keydown.enter="createUser"
          />
          <div class="flex items-center justify-center mt-8">
            <button class="authBtn" type="submit">
              <span v-if="!loading">Register</span
              ><span v-else class="animation-pulse">Loading...</span>
            </button>
          </div>
        </form>
      </div>
      <div class="mt-1 mb-6 text-sm font-light text-center text-gray-400">
        Have an account?
        <router-link to="/login" class="authRouterLink">Login here</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from "@vue/reactivity";
  import TextInput from "../components/molecules/TextInput.vue";
  import PwInput from "../components/molecules/PwInput.vue";
  import { createUserAcc } from "../firebase/auth";
  import Notification from "../components/molecules/Notification.vue";
  import useNotification from "../composable/useNotification";

  let name = ref("");
  let email = ref("");
  let password = ref("");
  let confirmPassword = ref("");
  // let popUpMsg = ref("");
  // let showMsg = ref(false);
  let loading = ref(false);
  const { isShown, modalMsg, triggerMessage } = useNotification();
  const createUser = async () => {
    // console.log('create');
    if (password.value !== confirmPassword.value) {
      triggerMessage("Password and confirm password must be same");
      password.value = "";
      confirmPassword.value = "";
      return;
    }
    loading.value = true;
    const userDetails = {
      email: email.value,
      name: name.value,
      password: password.value,
      chatGroupIds: [],
    };
    createUserAcc(userDetails);
    loading.value = false
  };
</script>
<style>
  .modal-enter-active,
  .modal-leave-active {
    transition: all 0.5s ease;
  }
  .modal-enter-from,
  .modal-leave-to {
    transform: translateY(-100px);
  }
</style>
