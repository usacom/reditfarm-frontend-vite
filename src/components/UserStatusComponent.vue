<script>
import { storeToRefs, mapState, mapWritableState } from "pinia";

import { useUserStore } from "@/stores/user";

export default {
  setup() {
    const store = useUserStore();
    store.$subscribe((mutation, state) => {
      let items = [];
      if (Array.isArray(mutation.events)) {
        console.log("mutation, state", mutation, state);
        items = mutation.events;
      } else {
        items = [mutation.events];
      }
      for (const item of items) {
        console.log("store key:", item.key);
        console.log("oldValue:", item.oldValue);
        console.log("newValue:", item.newValue);
      }
    });
    return {
      store,
    };
  },
  computed: {
    ...mapState(useUserStore, ["username"]),
  },
  methods: {},
};
</script>

<template>
  <div>isLogined: {{ store.isLogined }}</div>
  <div>isExpired: {{ store.isExpired }}</div>
  <div>hasKey: {{ store.hasKey }}</div>
  <div>username: {{ username }}</div>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
