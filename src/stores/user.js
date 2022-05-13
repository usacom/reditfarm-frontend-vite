import { defineStore } from "pinia";

import API from "../utils/api";

const api = new API(import.meta.env.VITE_APP_API_PATH);

export const useUserStore = defineStore("user", {
  state: () => {
    return {
      expires: "",
      username: "",
    };
  },
  getters: {
    hasKey() {
      const headers = localStorage.getItem("headers");
      if (headers !== null) {
        if (JSON.parse(headers).Authorization) {
          return !!JSON.parse(headers).Authorization.length;
        }
      }
      return false;
    },
    isExpired(state) {
      return !(new Date(state.expires) > new Date());
    },
    isLogined(state) {
      return !!state.username.length;
    },
  },
  actions: {
    async registerUser(username, password) {},
    async loginUser(username, password) {},
    async loadLoginData() {
      try {
        const response = await api.tokenStatus();
        this.username = response.data.username;
        this.expires = response.data.expires;
      } catch (e) {
        console.error(e);
      }
    },
  },
});
