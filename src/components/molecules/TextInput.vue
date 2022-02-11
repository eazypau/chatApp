<template>
  <div class="w-full">
    <input
      class="inputStyle"
      :type="type"
      :placeholder="name"
      :name="inputName"
      :required="required"
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
      type: {
        type: String,
        default: "text"
      },
      inputName: {
        type: String,
        required: true,
      },
      value: {
        type: String,
        default: "",
        required: true,
      },
      required: {
        type: Boolean,
        default: false
      }
    },
    setup(props, { emit }) {
      const onInput = (event: any) => {
        emit("update:modelValue", event.target.value);
      };
      return { onInput };
    },
  });
</script>
