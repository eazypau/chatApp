<template>
  <div class="w-full mt-4">
    <input
      class="inputStyle"
      type="text"
      :placeholder="name"
      :name="inputName"
      :value="value"
      @input="onInput"
    />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";

  export default defineComponent({
    props: {
      name: {
        type: String,
        required: true,
      },
      inputName: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        required: true,
      },
    },
    setup(props, { emit }) {
      const onInput = (event: any) => {
        emit("update:modelValue", event.target.value);
      };
      return { onInput };
    },
  });
</script>
