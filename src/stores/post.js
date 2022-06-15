import { defineStore } from "pinia";

import API from "../utils/api";
import { Result } from "../utils/Result";

import { useMainStore } from "./main";

const api = new API(import.meta.env.VITE_APP_API_PATH);

export const usePostStore = defineStore("post", {
  state: () => {
    return {
      posts: [],
      createPostForm: {
        type: "url",
        content: "",
        nsfw: true,
        spoiler: true,
        singlTitle: true,
        title: "",
        where: [
          // {
          //   subreddit: "",
          //   title: null,
          //   scheduledTime: null,
          //   flair: null,
          // },
        ],
      },
    };
  },
  getters: {
    selectedSubredits(state) {
      return state.createPostForm.where.map((sub) => sub.subreddit);
    },
    previewForm(state) {
      return state.createPostForm.where.map((sub) => {
        return {
          type: state.createPostForm.type,
          content: state.createPostForm.content,
          nsfw: state.createPostForm.nsfw,
          spoiler: state.createPostForm.spoiler,
          title: state.createPostForm.singlTitle
            ? state.createPostForm.title
            : sub.title,
          subreddit: sub.subreddit,
          flair: sub.flair,
          scheduledTime: sub.scheduledTime,
          status: sub.scheduledTime === null ? "SAVED" : "SCHEDULED",
        };
      });
    },
  },
  actions: {
    updateSelectedSubredits(value) {
      const filtred = this.createPostForm.where.filter((item) => {
        return value.indexOf(item.subreddit) !== -1;
      });
      if (value.length !== filtred.length) {
        const nameFiltred = filtred.map((item) => item.subreddit);
        const notHave = value.filter((item) => {
          return nameFiltred.indexOf(item) === -1;
        });
        const notHaveMaped = notHave.map((item) => {
          return {
            subreddit: item,
            title: null,
            scheduledTime: null,
            flair: null,
          };
        });
        this.createPostForm.where = [...filtred, ...notHaveMaped];
      } else {
        this.createPostForm.where = [...filtred];
      }
    },
    async loadPosts() {
      const main = useMainStore();
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
    async loadScheduledPosts(type = "NOTCANCELED") {
      const main = useMainStore();
      main.startLoading();
      try {
        const response = await api.getSchedulePosts(type);
        main.endLoading();
        return Result.ok(response.data);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
    async savePost() {
      const main = useMainStore();
      main.startLoading();
      try {
        const params = this.previewForm.map((post) => {
          return {
            ...post,
            content: post.content,
            nsfw: post.nsfw,
            spoiler: post.spoiler,
            status: post.status,
            subreddit: post.subreddit,
            title: post.title,
            type: post.type,
            scheduled_time: post.status === 'SAVED' ? new Date() : post.scheduledTime,
            flair: post.flair === null ? "" : post.flair,
          };
        });
        const response = await api.createPosts(params);
        main.endLoading();
        return Result.ok(response.data);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
  },
});
