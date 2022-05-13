import { defineStore } from "pinia";

// useStore could be anything like useUser, useCart
// the first argument is a unique id of the store across your application
export const useMainStore = defineStore("main", {
  state: () => {
    return {
      // all these properties will have their type inferred automatically
      count: 0,
      name: "Eduardo",
      menu: true,
      loading: false,
    };
  },
  getters: {
    // automatically infers the return type as a number
    doubleCount(state) {
      return state.count * 2;
    },
    /**
     *
     * @returns {number}
     */
    doublePlusOne() {
      // autocompletion and typings for the whole store ✨
      return this.doubleCount + 1;
    },
  },
});
