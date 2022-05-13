import { defineStore } from "pinia";

import API from "../utils/api";
import { Result } from "../utils/Result";

import { useMainStore } from './main'

const api = new API(import.meta.env.VITE_APP_API_PATH);

export const usePostStore = defineStore("post", {
  state: () => {
    return {
      posts: [],
    };
  },
  getters: {

  },
  actions: {
    async loadPosts() {
      const main = useMainStore()
      main.startLoading();
      try {
        const response = await api.getUserPosts();
        main.endLoading();
        return Result.ok(response.data);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
  },
});
