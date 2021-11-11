<template>
  <router-view></router-view>
</template>
<script setup lang="ts">
  import { onAuthStateChanged } from '@firebase/auth';
  import { auth } from './firebase/firebase';
  import { useStore } from './store/store';

  const store = useStore();
  onAuthStateChanged(auth, (user: any) => {
    if (user) {
      store.user = user.uid;
    }
  });
</script>
