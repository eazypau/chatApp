<template>
  <div class="w-screen h-screen flex items-center justify-center bg-gray-300 bg-opacity-75">
    <transition name="modal">
      <Notification v-if="showMsg" :errorMsg="popUpMsg" />
    </transition>

    <div class="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md">
      <div class="px-6 py-4">
        <h2 class="text-3xl font-bold text-center text-gray-700">EazyChat</h2>
        <p class="mt-1 text-center text-gray-500">Register</p>
        <form class="mt-3">
          <TextInput
            name="Name"
            inputName="name"
            :value="name"
            @update:model-value="name = $event"
          />
          <TextInput
          class="mt-2"
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
          />
          <PwInput
            name="ConfirmPassword"
            inputName="confirmPassword"
            :value="confirmPassword"
            @update:model-value="confirmPassword = $event"
            @keydown.enter="createUser"
          />
          <div class="flex items-center justify-center mt-4">
            <button class="authBtn" type="button" @click="createUser">Register</button>
          </div>
        </form>
      </div>
      <div class="flex items-center justify-center py-4 text-center bg-sky-50">
        <span class="text-sm text-gray-600">Have an account? </span>
        <router-link to="/login" class="authRouterLink">Login here</router-link>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from '@vue/reactivity';
  import TextInput from '../components/molecules/TextInput.vue';
  import PwInput from '../components/molecules/PwInput.vue';
  import { createUserAcc } from '../firebase/auth';
  import Notification from '../components/molecules/Notification.vue';

  let name = ref('');
  let email = ref('');
  let password = ref('');
  let confirmPassword = ref('');
  let popUpMsg = ref('');
  let showMsg = ref(false);
  const createUser = async () => {
    // console.log('create');
    if (
      name.value === '' ||
      email.value === '' ||
      password.value === '' ||
      confirmPassword.value === ''
    ) {
      popUpMsg.value = 'Please provide the information required.';
      showMsg.value = true;
      setTimeout(() => (showMsg.value = false), 2000);
      return;
    }
    if (password.value !== confirmPassword.value) {
      popUpMsg.value = 'Password and confirm password must be same';
      showMsg.value = true;
      setTimeout(() => (showMsg.value = false), 2000);
      password.value = '';
      confirmPassword.value = '';
      return;
    }
    const userDetails = {
      email: email.value,
      name: name.value,
      password: password.value,
    };
    createUserAcc(userDetails);
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
