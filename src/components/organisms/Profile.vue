<template>
  <div class="mx-auto relative minHeight z-20">
    <button @click="$emit('closeProfile')" type="button" class="absolute top-0 left-0 pt-2 pl-3">
      <i
        class="bi bi-arrow-left text-xl xl:text-2xl 2xl:text-3xl text-gray-600 hover:text-gray-300"
      ></i>
    </button>
    <div class="py-10 px-8 w-full flex-1">
      <div class="flex justify-center mb-7 relative">
        <div class="w-40 h-40 overflow-hidden rounded-full bg-gray-200">
          <img :src="profileImg" class="object-cover object-center w-full h-full" />
        </div>
        <div class="absolute bottom-0 ml-28">
          <p>
            <input
              class="hidden"
              type="file"
              accept="image/*"
              name="image"
              id="file"
              @change="updateProfilePic($event)"
            />
          </p>
          <p class="h-8 w-8 rounded-full bg-sky-400 flex justify-center items-center hover:text-white cursor-pointer">
            <label
              for="file"
              style="cursor: pointer"
            >
              <i class="bi bi-upload"></i>
            </label>
          </p>
        </div>
      </div>
      <table>
        <tr>
          <td class="xl:text-lg font-bold">Name:</td>
          <td>
            <p v-if="!edit" class="px-1 py-1 xl:text-lg">{{ userName }}</p>
            <div v-else>
              <TextInput
                name="name"
                inputName="name"
                :value="name"
                @update:model-value="name = $event"
              />
            </div>
          </td>
        </tr>
        <tr>
          <td class="xl:text-lg font-bold">Email:</td>
          <td>
            <p v-if="!edit" class="px-1 py-1 xl:text-lg">{{ userEmail }}</p>
            <div v-else>
              <TextInput
                name="email"
                inputName="email"
                :value="email"
                @update:model-value="email = $event"
              />
            </div>
          </td>
        </tr>
      </table>
      <div class="flex justify-end mt-5">
        <div v-if="!edit">
          <button
            type="button"
            @click="edit = true"
            class="rounded px-3 py-0.5 bg-sky-400 hover:text-white mr-2"
          >
            <i class="bi bi-pencil-square text-xl mr-1"></i>
            Edit
          </button>
          <button type="button" class="rounded px-3 py-0.5 bg-red-400 hover:text-white">
            <i class="bi bi-trash-fill text-xl"></i>
            Delete
          </button>
        </div>
        <div v-else>
          <button
            type="button"
            @click="updateProfile"
            class="rounded px-3 py-0.5 bg-sky-400 hover:text-white mr-2"
          >
            <i class="bi bi-check2-square text-xl mr-1"></i>
            Update
          </button>
          <button
            type="button"
            @click="cancelEdit"
            class="rounded px-3 py-0.5 bg-red-400 hover:text-white"
          >
            <i class="bi bi-x text-xl"></i>
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { ref } from '@vue/reactivity';
  import TextInput from '../molecules/TextInput.vue';
  import { useStore } from '../../store/store';

  export default defineComponent({
    props: {
      profileImg: String,
      userName: String,
      userEmail: String,
    },
    setup(props) {
      const store = useStore();
      let edit = ref(false);
      let name = ref(props.userName);
      let email = ref(props.userEmail);

      const cancelEdit = () => {
        edit.value = false;
        name.value = props.userName;
        email.value = props.userEmail;
      };

      const updateProfile = async () => {
        const newProfileInfo:any = {
          name: name.value,
          email: email.value,
        };
        await store.updateUserProfileInfo(newProfileInfo);
        edit.value = false;
      };

      const updateProfilePic = async (event: any) => {
        await store.uploadProfileImage(event.target.files[0]);
      };
      return { edit, name, email, cancelEdit, updateProfile, updateProfilePic };
    },
    components: { TextInput },
  });
</script>
<style>
  .minHeight {
    min-height: 93vh;
  }
</style>
