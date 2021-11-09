import { getDownloadURL, ref, uploadBytesResumable } from '@firebase/storage';
import { defineStore } from 'pinia';
import { user } from '../classes/type';
import { updateUserAccEmail } from '../firebase/auth';
import { storage } from '../firebase/firebase';
import { readUserProfile, updateUserEmail, updateUserName, updateUserPhoto } from '../firebase/profile';

interface ChatState {
  count: number;
  user: string;
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
    async updateUserProfileInfo(newProfileInfo: { name: string; email: string }) {
      try {
        updateUserName(this.user, newProfileInfo.name);
        updateUserAccEmail(newProfileInfo.email);
        updateUserEmail(this.user, newProfileInfo.email);
        this.profile.name = newProfileInfo.name;
        this.profile.email = newProfileInfo.email;
      } catch (error) {
        console.log(error);
      }
    },
    async uploadProfileImage(file: any) {
      try {
        const uid = this.user;
        const storageRef = ref(storage, uid);
        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            if (progress === 100) {
              // store.commit('loadingStatus', false);
              // store.commit('changeImgSrc', URL.createObjectURL(file));
              alert('Upload complete!');
            }
          },
          (error) => {
            console.log('Fail to upload new profle picture...');
            console.log(error);
            alert('Failed to update profile picture...');
          },
          () => {
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              this.profile.photo = downloadURL;
              updateUserPhoto(this.user, downloadURL)
            });
          }
        );
      } catch (error) {}
    },
  },
});
