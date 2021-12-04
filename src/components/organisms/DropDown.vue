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
                @click="$emit('openAddContactWindow')"
              >
                <i class="bi bi-person-plus-fill pr-3"></i>
                Add Contact
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
                @click="$emit('openContactWindow')"
              >
                <i class="bi bi-person-lines-fill pr-3"></i>
                <p class="pb-1">Contacts</p>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 py-2 text-sm',
                ]"
                @click="$emit('openProfile')"
              >
                <i class="bi bi-eyeglasses pr-3"></i>
                <p class="pb-1">Profile</p>
              </button>
            </MenuItem>
            <MenuItem v-slot="{ active }">
              <button
                :class="[
                  active ? 'bg-secondary-light text-black' : 'text-gray-900',
                  'group flex rounded-md items-center w-full px-2 pt-1 pb-2 text-sm',
                ]"
                @click="logOut"
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
<script lang="ts">
  import { defineComponent } from "vue";
  import { Menu, MenuButton, MenuItems, MenuItem } from "@headlessui/vue";
  import { logOutUser } from "../../firebase/auth";
  import { useStore } from "../../store/store";

  export default defineComponent({
    name: "DropDown",
    components: { Menu, MenuButton, MenuItems, MenuItem },
    setup() {
      const store = useStore();
      const logOut = () => {
        // console.log("log out...");
        logOutUser();
        store.$reset();
      };
      return { store, logOut };
    },
  });
</script>
