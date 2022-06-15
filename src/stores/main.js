import { defineStore } from "pinia";

export const useMainStore = defineStore("main", {
  state: () => {
    return {
      menu: true,
      loading: false,
    };
  },
  getters: {
  },
  actions: {
    startLoading(){
      this.loading = true;
    },
    endLoading(){
      this.loading = false;
    },
  },
});
