<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
  import { onAuthStateChanged } from '@firebase/auth';
  import { auth } from './firebase/firebase';
  import router from './router';
  import { useStore } from './store/store';
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  // const store = useStore();
  // onAuthStateChanged(auth, (user: any) => {
  //   if (user) {
  //     // store user uid
  //     store.user = user.uid;
  //   } else {
  //     router.push({ name: 'Login' });
  //   }
  // });
</script>
