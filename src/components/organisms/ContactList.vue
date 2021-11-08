<template>
  <div class="absolute z-10 inset-0 w-screen h-screen flex items-center justify-center bg-slate-500 bg-opacity-40">
    <div class="w-96 h-72 bg-white border rounded-md overflow-hidden relative">
      <button @click="$emit('closeContact')" class="absolute right-2 top-2 p-1">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="px-6 py-3 bg-sky-100">
        <p class="font-semibold">Contact List</p>
      </div>
      <div
        v-for="friend in contacts"
        :key="friend"
        @click="$emit('createChat')"
        class="flex items-center py-2 px-4 border-b border-gray-300 hover:bg-gray-100"
      >
        <img class="h-8 rounded-full" :src="friend.profilePhoto" />
        <p class="pl-2 text-sm">{{ friend.name }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: ["contacts"],
    setup() {},
  });
</script>
