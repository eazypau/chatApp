<template>
  <div class="mx-auto relative minHeight z-20 border-t border-secondary-dark">
    <button class="absolute top-0 left-0 pt-2 pl-3" type="button" @click="$emit('closeProfile')">
      <i
        class="bi bi-arrow-left text-xl xl:text-2xl 2xl:text-3xl text-gray-600 hover:text-gray-300"
      ></i>
    </button>
    <div class="py-10 px-8 w-full flex-1">
      <div class="flex justify-center mb-7 relative">
        <div class="w-40 h-40 overflow-hidden rounded-full bg-gray-200">
          <img :src="profileImg" class="object-cover object-center w-full h-full" />
        </div>
        <div v-if="isUser" class="absolute bottom-0 ml-28">
          <p>
            <input
              id="file"
              class="hidden"
              type="file"
              accept="image/*"
              name="image"
              @change="updateProfilePic($event)"
            />
          </p>
          <p
            class="
              h-8
              w-8
              rounded-full
              bg-sky-400
              flex
              justify-center
              items-center
              hover:text-white
              cursor-pointer
            "
          >
            <label for="file" style="cursor: pointer">
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
                input-name="name"
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
                input-name="email"
                :value="email"
                @update:model-value="email = $event"
              />
            </div>
          </td>
        </tr>
      </table>
      <div v-if="isUser" class="flex justify-end mt-5">
        <div v-if="!edit">
          <button
            class="rounded px-3 py-0.5 bg-sky-400 hover:text-white mr-2"
            type="button"
            @click="edit = true"
          >
            <i class="bi bi-pencil-square text-xl mr-1"></i>
            Edit
          </button>
          <button class="rounded px-3 py-0.5 bg-red-400 hover:text-white" type="button" @click="deleteAccount">
            <i class="bi bi-trash-fill text-xl"></i>
            Delete
          </button>
        </div>
        <div v-else>
          <button
            class="rounded px-3 py-0.5 bg-sky-400 hover:text-white mr-2"
            type="button"
            @click="updateProfile"
          >
            <i class="bi bi-check2-square text-xl mr-1"></i>
            Update
          </button>
          <button
            class="rounded px-3 py-0.5 bg-red-400 hover:text-white"
            type="button"
            @click="cancelEdit"
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
  import { defineComponent } from "vue";
  import { ref } from "@vue/reactivity";
  import TextInput from "../molecules/TextInput.vue";
  import { useStore } from "../../store/store";

  export default defineComponent({
    name: "ProfileWindow",
    components: { TextInput },
    props: {
      profileImg: String,
      userName: String,
      userEmail: String,
      isUser: {
        type: Boolean,
        default: false,
      },
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
        const newProfileInfo: any = {
          name: name.value,
          email: email.value,
        };
        await store.updateUserProfileInfo(newProfileInfo);
        edit.value = false;
      };

      const updateProfilePic = async (event: any) => {
        await store.uploadProfileImage(event.target.files[0]);
      };

      const deleteAccount = async () => {
        const contacts = store.getContactList;
        for (let contact of contacts) {
          const contactId = contact.id;
          await store.deleteContact(contactId);
        }
        store.deleteProfileImg()
        await store.deleteProfileDoc()
      };
      return { edit, name, email, cancelEdit, updateProfile, updateProfilePic, deleteAccount };
    },
  });
</script>
<style>
  .minHeight {
    min-height: 97vh;
  }
</style>
