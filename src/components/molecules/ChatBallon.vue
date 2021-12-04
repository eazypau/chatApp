<template>
  <div
    :class="[message.sendBy !== profile.id ? 'justify-start' : 'justify-end', 'w-full mb-2 flex']"
  >
    <div class="rounded-md bg-gray-200 px-5 py-2 w-max">
      <!-- chat ballon -->
      <p>
        {{ message.text }}
        <!-- <span class="msgFooter relative ml-2 -right-3 -bottom-1">{{
          String(message.sentAt.toDate()).substring(16, 21)
        }}</span> -->
      </p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  // import { ref } from "@vue/reactivity";
  // import useDummy from "../../composable/useDummy";
  import { useStore } from "../../store/store";

  export default defineComponent({
    props: {
      message: {
        type: Object,
        default: () => {},
      },
    },
    setup() {
      // const { currentUserName } = useDummy();
      // const isMatch = ref(false);
      const store = useStore();
      const profile = store.getProfile;
      //* reference: https://www.py4u.net/discuss/299247
      // const date = props.message.sentAt.toDate();
      // console.log(String(date).substring(15,21));

      return { profile };
    },
  });
</script>
<style>
  .msgFooter {
    font-size: 10px;
  }
</style>
