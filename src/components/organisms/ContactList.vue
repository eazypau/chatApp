<template>
  <!-- <div
    class="
      absolute
      z-30
      inset-0
      w-screen
      h-screen
      flex
      items-center
      justify-center
      bg-slate-200 bg-opacity-40
      px-5
    "
    @click="$emit('closeContact')"
  >
    <div class="w-96 h-72 bg-white shadow-xl rounded-md overflow-hidden relative">
      <button class="absolute right-2 top-2 p-1" @click="$emit('closeContact')">
        <i class="bi bi-x-lg text-white"></i>
      </button>
      <div class="px-6 py-3 bg-dark-blue">
        <p class="font-bold text-lg text-white">Contact List</p>
      </div>
      <div
        v-for="(friend, index) in contacts"
        :key="index"
        class="px-1 hover:bg-gray-100 cursor-pointer"
        @click="$emit('createChat', friend)"
      >
        <div class="flex items-center py-2 px-3 hover:bg-gray-100">
          <img
            class="w-8 h-8 rounded-full object-cover"
            :src="
              friend.photo === ''
                ? 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
                : friend.photo
            "
          />
          <p class="pl-2 text-sm font-semibold">{{ friend.name }}</p>
        </div>
        <div class="h-px w-full bg-gray-300"></div>
      </div>
    </div>
  </div> -->
  <TransitionRoot appear :show="isOpen" as="div">
		<Dialog as="div" @close="$emit('closeContact')">
			<div class="fixed inset-0 z-30 overflow-y-auto bg-slate-200 bg-opacity-40">
				<div class="min-h-screen px-4 text-center">
					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0"
						enter-to="opacity-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100"
						leave-to="opacity-0"
					>
						<DialogOverlay class="fixed inset-0" />
					</TransitionChild>

					<span class="inline-block h-screen align-middle" aria-hidden="true"> &#8203; </span>

					<TransitionChild
						as="template"
						enter="duration-300 ease-out"
						enter-from="opacity-0 scale-95"
						enter-to="opacity-100 scale-100"
						leave="duration-200 ease-in"
						leave-from="opacity-100 scale-100"
						leave-to="opacity-0 scale-95"
					>
						<div
							class="w-full md:w-96 h-72 inline-block max-w-md my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
						>
							<DialogTitle as="h3" class="px-6 py-3 bg-dark-blue text-lg font-bold leading-6 text-white"> Contact List </DialogTitle>
							<div
                v-for="(friend, index) in contacts"
                :key="index"
                class="px-1 hover:bg-gray-100 cursor-pointer"
                @click="$emit('createChat', friend)"
              >
                <div class="flex items-center py-2 px-3 hover:bg-gray-100">
                  <img
                    class="w-8 h-8 rounded-full object-cover"
                    :src="
                      friend.photo === ''
                        ? 'https://pbs.twimg.com/profile_images/1176237957851881472/CHOXLj9b_400x400.jpg'
                        : friend.photo
                    "
                  />
                  <p class="pl-2 text-sm font-semibold">{{ friend.name }}</p>
                </div>
                <div class="h-px w-full bg-gray-300"></div>
              </div>
						</div>
					</TransitionChild>
				</div>
			</div>
		</Dialog>
	</TransitionRoot>
</template>
<script lang="ts">
  import { defineComponent } from "vue";
  import { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";

  export default defineComponent({
    components: { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogTitle },
    props: {
      contacts: {
        type: [Array, Object],
        default: () => [],
        //* https://antenna.io/blog/2017/12/custom-validator-function-that-checks-if-object-properties-exist-in-vue-js/
        // validator: (items: []) => {
        //   const validItems = items.filter((item: {}) => {
        //     // eslint-disable-next-line no-prototype-builtins
        //     return item.hasOwnProperty('name') && item.hasOwnProperty('photo')
        //   })
        // }
      },
      isOpen: {
				type: Boolean,
			},
    },
  });
</script>
