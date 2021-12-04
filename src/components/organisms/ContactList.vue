<template>
  <div
    class="
      absolute
      z-10
      inset-0
      w-screen
      h-screen
      flex
      items-center
      justify-center
      bg-slate-500 bg-opacity-40
    "
  >
    <div class="w-96 h-72 bg-white border rounded-md overflow-hidden relative">
      <button class="absolute right-2 top-2 p-1" @click="$emit('closeContact')">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="px-6 py-3 bg-sky-100">
        <p class="font-semibold">Contact List</p>
      </div>
      <div
        v-for="friend, index in contacts"
        :key="index"
        class="flex items-center py-2 px-4 border-b border-gray-300 hover:bg-gray-100"
        @click="$emit('createChat', friend)"
      >
        <img
          class="w-8 h-8 rounded-full"
          :src="
            friend.photo === ''
              ? 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
              : friend.photo
          "
        />
        <p class="pl-2 text-sm">{{ friend.name }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      contacts: {
        type: [Array, Object],
        default: () => [],
        //* https://antenna.io/blog/2017/12/custom-validator-function-that-checks-if-object-properties-exist-in-vue-js/
        // validator: (items: []) => {
        //   const validItems = items.filter((item: {}) => {
        //     // eslint-disable-next-line no-prototype-builtins
        //     return item.hasOwnProperty('name') && item.hasOwnProperty('photo')
        //   })
        // }
      }
    },
  });
</script>
