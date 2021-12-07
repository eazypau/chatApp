import { ref } from "@vue/reactivity";
let isShown = ref(false);
let modalMsg = ref("");
export default () => {
  const triggerMessage = (msg: string) => {
    modalMsg.value = msg;
    isShown.value = true;
    setTimeout(() => (isShown.value = false), 3500);
  };
  return { isShown, modalMsg, triggerMessage };
};
