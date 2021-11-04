<template>
  <div
    :class="[
      message.name !== currentUserName ? 'justify-start' : 'justify-end',
      'w-full mb-2 flex',
    ]"
    v-for="message in messageList.messages"
    :key="message"
  >
    <div class="rounded-md bg-gray-200 px-2 py-1 w-max">
      <!-- chat ballon -->
      <p>{{ message.message }}</p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { ref } from "@vue/reactivity";
  import useDummy from "../../composable/useDummy";

  export default defineComponent({
    props: ["messageList"],
    setup(props) {
      const { currentUserName } = useDummy();
      const isMatch = ref(false);
      return { currentUserName };
    },
  });
</script>
