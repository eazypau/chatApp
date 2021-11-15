<template>
  <div class="flex flex-col min-h-screen">
    <NavigationBar />
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
  import NavigationBar from '../components/organisms/NavigationBar.vue';
</script>