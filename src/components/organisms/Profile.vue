<template>
  <div class="mx-auto relative minHeight z-20">
    <button @click="$emit('closeProfile')" type="button" class="absolute top-0 left-0 pt-2 pl-3">
      <i class="bi bi-arrow-left text-xl xl:text-2xl 2xl:text-3xl text-gray-600 hover:text-gray-300"></i>
    </button>
    <div class="py-10 px-8 w-full flex flex-col flex-1 items-center">
      <img :src="profileImg" class="h-20 xl:h-32 rounded-full" />
      <div class="mt-10 w-full">
        <!-- Need to add the editing feature later on -->
        <p class="mb-4 text-sm xl:text-base">Name: {{ userName }}</p>
        <p class=" text-sm xl:text-base">Emai: {{ userEmail }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      profileImg: {
        type: String,
        default: "https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg",
      },
      userName: String,
      userEmail: String,
    },
  });
</script>
<style>
  .minHeight {
    min-height: 93vh;
  }
</style>
