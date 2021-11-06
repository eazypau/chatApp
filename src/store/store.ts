import { defineStore } from "pinia";

interface ChatState {
  count: number;
  user: any;
}

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    count: 0,
    user: {},
  }),
  getters: {
    getCount(state) {
      return state.count;
    },
  },
  actions: {},
});
