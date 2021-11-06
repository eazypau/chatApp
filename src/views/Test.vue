<template>
  <div class="flex viewHeight">
    <div class="px-20 py-6">
      <h1>test using array union</h1>
      <button @click="createDummyDoc" class="border py-1 px-3 bg-sky-400">Click to create doc</button>
      <button @click="addElementIntoDocArray" class="border py-1 px-3 bg-sky-400">Click to update doc</button>
    </div>
  </div>
</template>
<script setup lang="ts">
  import { arrayUnion, doc, setDoc, updateDoc } from "@firebase/firestore";
  import { db } from "../firebase/firebase";

  //! serverTimeStamp doesnt work in arrays
  const createDummyDoc = async () => {
    await setDoc(doc(db, "dummy", "dummy2"), {
      name: "something",
      id: "dummy",
      messages: [
        {
          timestamp: Date(),
          content: "Hey there!"
        },
      ],
    });
    alert("successfully create dummy doc...")
  };

  const addElementIntoDocArray = async () => {
    await updateDoc(doc(db, "dummy", "dummy"), {
      messages: arrayUnion(
        {
          timestamp: Date(),
          content: "it works with timestamp!"
        }
      )
    })
  }
</script>
<style>
  .viewHeight {
    height: 93vh;
  }
</style>
