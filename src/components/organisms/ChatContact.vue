<template>
  <div
    @click="viewChat"
    class="flex items-center py-2 px-4 border-b border-gray-300 hover:cursor-pointer"
  >
    <img
      class="h-10 rounded-full"
      src="https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg"
    />
    <div class="pl-3">
      <p class="text-sm">{{ name }}</p>
      <p class="text-xs">{{ item.recentMessage.messageText }}</p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, ref } from "vue";
  import { useStore } from "../../store/store";

  export default defineComponent({
    props: ["item"],
    setup(props, { emit }) {
      const store = useStore();
      const name = ref("");
      const viewChat = () => {
        console.log("view chat");
        emit("passId", props.item.id, name.value);
      };
      const getName = async () => {
        const findUserId = props.item.members.filter((item:string) => {
          return item !== store.getProfile.id
        })
        const fetchName: any = await store.fetchOtherUserDetails(findUserId[0]);
        name.value = fetchName.name;
      };
      onBeforeMount(async () => await getName())
      return { viewChat, name };
    },
  });
</script>
