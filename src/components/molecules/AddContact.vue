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
    "
    @click="$emit('closeContact')"
  >
    <div class="bg-white rounded-md shadow-xl overflow-hidden relative p-5">
      <button class="absolute right-2 top-1 p-1 hover:text-red-600" @click="$emit('closeContact')">
        <i class="bi bi-x-lg text-xl"></i>
      </button>
      <div class="pl-1 font-bold text-xl">
        <p>Add Contact</p>
      </div>
      <div class="mt-2 flex justify-between border-2 rounded-md">
        <input
          id="email"
          v-model="userEmail"
          type="text"
          name="email"
          class="w-60 pl-2"
        />
        <button class="py-1 px-2 border-l-2 hover:bg-gray-200" @click="addContacts">
          <i class="bi bi-plus text-xl font-bold"></i>
        </button>
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
							class="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
						>
							<DialogTitle as="h3" class="text-lg font-medium leading-6 text-gray-900"> Add Contact </DialogTitle>
							<div class="mt-2">
								<div class="mt-2 flex border-2 rounded-md">
									<input id="email" v-model="userEmail" type="text" name="email" class="flex-1 pl-2" />
									<button class="py-1 px-2 border-l-2 hover:bg-gray-200" @click="addContacts">
										<i class="bi bi-plus text-xl font-bold"></i>
									</button>
								</div>
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
	import { ref } from "@vue/reactivity";
	import { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogTitle } from "@headlessui/vue";
	import { useStore } from "../../store/store";

	export default defineComponent({
		name: "AddContact",
		components: { TransitionRoot, TransitionChild, Dialog, DialogOverlay, DialogTitle },
		props: {
			isOpen: {
				type: Boolean,
			},
		},
		setup() {
			let userEmail = ref("");
			// let name = ref("");
			const store = useStore();
			const addContacts = async () => {
				if (userEmail.value === "") {
					return;
				}
				await store.addUserContact(userEmail.value);
				userEmail.value = "";
				// name.value = "";
			};
			return { userEmail, store, addContacts };
		},
	});
</script>
