import { defineStore } from "pinia";

import API from "../utils/api";
import { Result } from "../utils/Result";

import { useMainStore } from "./main";
import { usePostStore } from "./post";

const api = new API(import.meta.env.VITE_APP_API_PATH);

export const useSubredditStore = defineStore("subreddit", {
  state: () => {
    return {
      subreddits: [],
    };
  },
  getters: {
  },
  actions: {
    async loadMySubreddit() {
      const main = useMainStore();
      main.startLoading();
      try {
        const response = await api.getUserSubreddits();
        main.endLoading();
        return Result.ok(response.data);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
    async loadSelectedSubreditsInfo(){
      const main = useMainStore();
      const post = usePostStore();
      main.startLoading();
      try {
        const response = await api.getSubredditsInfo(post.selectedSubredits);
        main.endLoading();
        return Result.ok(response.data);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
  },
});
