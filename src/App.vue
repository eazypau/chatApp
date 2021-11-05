<template>
  <div class="flex flex-col min-h-screen">
    <NavigationBar />
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
  import { onAuthStateChanged } from '@firebase/auth';
  import NavigationBar from './components/organisms/NavigationBar.vue';
  import { auth } from './firebase/firebase';
  import router from './router';
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
  onAuthStateChanged(auth, (user: any) => {
    if (user) {
      const uid = user.uid;
    } else {
      // router.push({ name: 'Login' });
    }
  });
</script>
