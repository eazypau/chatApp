import { defineStore } from "pinia";

interface ChatState {
  count: number;
}

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    count: 0,
  }),
  getters: {
    getCount(state) {
      return state.count;
    },
  },
  actions: {},
});
