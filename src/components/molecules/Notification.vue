<template>
  <div class="absolute z-50 inset-x-0 top-0 flex justify-center pt-3">
    <div class="border border-black bg-white px-6 py-2 rounded-md fixed">
      <p>{{ errorMsg }}</p>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  export default defineComponent({
    name: "NotificationModal",
    props: {
      errorMsg: {
        type: String,
      },
    },
  });
</script>