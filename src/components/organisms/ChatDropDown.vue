<template>
  <div class="flex items-center relative">
    <Menu as="div" class="relative inline-block text-left">
      <div>
        <MenuButton>
          <i class="bi bi-three-dots-vertical text-xl text-white"></i>
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
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
                @click="$emit('viewContactDetails')"
              >
                <i class="bi bi-binoculars-fill pr-3"></i>
                View Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex md:hidden rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
                @click="$emit('quitChat')"
              >
                <i class="bi bi-arrow-90deg-left pr-3"></i>
                Back
              </button>
            </MenuItem>
            <!-- <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
                @click="$emit('deleteChat')"
              >
                <i class="bi bi-trash-fill pr-3"></i>
                Chat History
              </button>
            </MenuItem> -->
          </div>
        </MenuItems>
      </transition>
    </Menu>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";

  export default defineComponent({
    name: "ChatDropDown",
    components: { Menu, MenuButton, MenuItems, MenuItem },
  });
</script>
