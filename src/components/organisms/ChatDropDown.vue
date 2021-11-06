<template>
  <div class="flex items-center relative">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton>
          <i class="bi bi-three-dots-vertical text-xl"></i>
        </MenuButton>
      </div>
      <transition
        enter-active-class="transition duration-100 ease-out"
        enter-from-class="transform scale-95 opacity-0"
        enter-to-class="transform scale-100 opacity-100"
        leave-active-class="transition duration-75 ease-in"
        leave-from-class="transform scale-100 opacity-100"
        leave-to-class="transform scale-95 opacity-0"
      >
        <MenuItems class="menuItemContainer">
          <div class="px-1 py-1">
            <MenuItem v-slot="{ active }">
              <button
                @click="emit('viewContactDetails')"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
              >
                <i class="bi bi-binoculars-fill pr-3"></i>
                View Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="emit('deleteChat')"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
              >
                <i class="bi bi-trash-fill pr-3"></i>
                Chat History
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
<script setup lang="ts">
  import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
  const emit = defineEmits<{
    (e: 'viewContactDetails'): void;
    (e: 'deleteChat'): void;
  }>();
</script>
