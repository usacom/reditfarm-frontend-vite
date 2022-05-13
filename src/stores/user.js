import { defineStore } from "pinia";

import API from "../utils/api";
import { Result } from "../utils/Result";

import { useMainStore } from './main'

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
    async authByReddit() {
      try {
        const login = (await api.loginLink()).data;
        window.open(login, "_self");
      } catch (e) {
        console.log(e);
      }
    },
    async registerUser(code, password) {
      const main = useMainStore()
      main.startLoading();
      try {
        const responce = await api.siginUp({ password, code });
        main.endLoading();
        return Result.ok(responce.data.username);
      } catch (e) {
        main.endLoading();
        console.log(e);
        if (e.response.status === 400 && e.response.data.detail) {
          return Result.error(new Error(e.response.data.detail));
        }
        return Result.error(new Error("Error of register. Try again later."));
      }
    },
    async loginUser(username, password) {
      const main = useMainStore()
      main.startLoading();
      try {
        const params = {
          username,
          password,
        };
        const response = await api.getToken(params);
        if (response.data.token_type === "bearer") {
          const authToken = `Bearer ${response.data.access_token}`;
          api.setHeaders({
            Authorization: authToken,
            Accept: "application/json",
          });
          main.endLoading();
          return Result.ok(true);
        }
        main.endLoading();
        return Result.ok(true);
      } catch (e) {
        main.endLoading();
        return Result.error(new Error("Something wrong."));
      }
    },
    logout() {
      if (this.isLogined) {
        api.setHeaders({ Authorization: "", Accept: "application/json" });
      }
    },
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
