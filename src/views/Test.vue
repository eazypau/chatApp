<template>
  <div class="flex viewHeight">
    <div class="px-20 py-6">
      <Notification v-if="showNotification" :error-msg="errorMsg" />
      <h1>test using array union</h1>
      <button @click="showErrorMessage" class="border py-1 px-3 bg-sky-400">
        show Error
      </button>
      <button @click="addElementIntoDocArray" class="border py-1 px-3 bg-sky-400">
        Click to update doc
      </button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { arrayUnion, doc, setDoc, updateDoc } from '@firebase/firestore';
  import { db } from '../firebase/firebase';
  import Notification from '../components/molecules/Notification.vue';
  import { ref } from '@vue/reactivity';

  let errorMsg = ref('');
  let showNotification = ref(false);

  //! serverTimeStamp doesnt work in arrays
  const createDummyDoc = async () => {
    await setDoc(doc(db, 'dummy', 'dummy2'), {
      name: 'something',
      id: 'dummy',
      messages: [
        {
          timestamp: Date(),
          content: 'Hey there!',
        },
      ],
    });
    alert('successfully create dummy doc...');
  };

  const addElementIntoDocArray = async () => {
    await updateDoc(doc(db, 'dummy', 'dummy'), {
      messages: arrayUnion({
        timestamp: Date(),
        content: 'it works with timestamp!',
      }),
    });
  };

  const showErrorMessage = () => {
    errorMsg.value = 'message is shown';
    showNotification.value = true;
    setTimeout(() => (showNotification.value = false), 2000);
  };
</script>
<style>
  .viewHeight {
    height: 93vh;
  }
</style>
