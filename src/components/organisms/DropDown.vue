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
                @click="emit('openAddContactWindow')"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
              >
                <i class="bi bi-person-plus-fill pr-3"></i>
                Add Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="emit('openContactWindow')"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
              >
                <i class="bi bi-person-lines-fill pr-3"></i>
                <p class="pb-1">Contacts</p>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="emit('openProfile')"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
              >
                <i class="bi bi-eyeglasses pr-3"></i>
                <p class="pb-1">Profile</p>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                @click="logOut"
                :class="[
                  active ? 'bg-violet-500 text-white' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 pt-1 pb-2 text-sm',
                ]"
              >
                <i class="bi bi-box-arrow-left pr-3"></i>
                <p class="pb-1">Sign Out</p>
              </button>
            </MenuItem>
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
<script setup lang="ts">
  import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
  import { logOutUser } from '../../firebase/auth';

  const emit = defineEmits<{
    (e: "openAddContactWindow"): void;
    (e: "openContactWindow"): void;
    (e: "openProfile"): void;
  }>();
  const logOut = () => {
    console.log("log out...");
    logOutUser()
  };
</script>
