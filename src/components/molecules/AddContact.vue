<template>
  <div class="absolute z-10 inset-0 w-screen h-screen flex items-center justify-center">
    <div class="bg-white border rounded-md overflow-hidden relative p-2">
      <button @click="$emit('closeContact')" class="absolute right-2 top-1 p-1">
        <i class="bi bi-x-lg"></i>
      </button>
      <div class="pl-1 font-semibold text-lg">
        <p>Add Contact</p>
      </div>
      <div class="p-1 flex justify-between">
        <input type="text" name="email" id="email" class="border rounded h-8 w-60 pl-2" />
        <button class="pl-2">
          <i class="bi bi-plus-square text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>
