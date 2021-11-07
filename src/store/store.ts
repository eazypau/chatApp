import { defineStore } from "pinia";
import { user } from "../classes/type";

interface ChatState {
  count: number;
  user: any;
  profile: user;
}

export const useStore = defineStore("store", {
  state: (): ChatState => ({
    count: 0,
    user: {},
    profile: {
      id: "",
      name: "",
      email: "",
      photo: "",
    },
  }),
  getters: {
    getCount(state) {
      return state.count;
    },
    getProfile(state) {
      return state.profile;
    },
  },
  actions: {},
});
