<template>
  <div class="flex flex-col min-h-screen">
    <NavigationBar />
    <router-view class="flex-1 flex items-center"></router-view>
  </div>
</template>
<script setup lang="ts">
  import NavigationBar from "./components/organisms/NavigationBar.vue";
  // This starter template is using Vue 3 <script setup> SFCs
  // Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
</script>
