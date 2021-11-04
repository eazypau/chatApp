<template>
  <div @click="viewChat" class="flex items-center py-2 px-4 border-b border-gray-300">
    <img
      class="h-10 rounded-full"
      src="https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg"
      alt=""
    />
    <div class="text-xs pl-2">
      <p class="mb-0.5">{{ item.name }}</p>
      <p>{{ item.lastMessage }}</p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: ["item"],
    setup(props, { emit }) {
      const viewChat = () => {
        console.log("view chat");
        emit("passId", props.item.chatId);
      };
      return { viewChat };
    },
  });
</script>
