import { defineStore } from 'pinia';
import { user } from '../classes/type';
import { readUserProfile } from '../firebase/profile';

interface ChatState {
  count: number;
  user: any;
  profile: user;
}

export const useStore = defineStore('store', {
  state: (): ChatState => ({
    count: 0,
    user: '',
    profile: {
      id: '',
      name: '',
      email: '',
      photo: '',
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
  actions: {
    async fetchUserProfile() {
      try {
        const res: any = await readUserProfile(this.user);
        this.profile = res;
        // console.log(this.profile);
      } catch (error) {
        console.log(error);
      }
    },
  },
});
