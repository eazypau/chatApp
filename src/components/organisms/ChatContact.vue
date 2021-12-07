<template>
  <div class="hover:bg-gray-100">
    <div
      class="flex items-center mx-2 py-2 px-2 border-b border-gray-200 hover:cursor-pointer"
      @click="viewChat"
    >
      <img
        class="w-10 h-10 rounded-full"
        :src="
          photo
            ? photo
            : 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
        "
      />
      <div class="pl-3">
        <p class="text-sm font-medium">{{ name }}</p>
        <p class="text-xs">{{ item.recentMessage.messageText }}</p>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, onBeforeMount, ref } from "vue";
  import { useStore } from "../../store/store";

  export default defineComponent({
    props: {
      item: {
        type: Object,
        default: () => {},
      },
    },
    setup(props, { emit }) {
      const store = useStore();
      const name = ref("");
      const photo = ref("");
      const viewChat = () => {
        // console.log("view chat");
        const chatDoc = {
          id: props.item.id,
          name: name.value,
          photo: photo.value,
          members: props.item.members,
        };
        emit("passId", chatDoc);
      };
      const getName = async () => {
        const findUserId = props.item.members.filter((item: string) => {
          return item !== store.getProfile.id;
        });
        const fetchName: any = await store.fetchOtherUserDetails(findUserId[0]);
        name.value = fetchName.name;
        photo.value = fetchName.photo;
      };
      onBeforeMount(async () => await getName());
      return { viewChat, name, photo };
    },
  });
</script>
