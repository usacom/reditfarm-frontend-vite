<script>
import { storeToRefs, mapState, mapWritableState } from "pinia";

import { useMainStore } from "@/stores/main";

export default {
  setup() {
    const store = useMainStore();
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
  props: {
    msg: { type: String },
  },
  data() {
    return {};
  },
  computed: {
    ...mapWritableState(useMainStore, ["count"]),
  },
  methods: {
    test() {
      this.store.$patch({
        count: this.store.count + 1,
        name: "Abalam",
      });
    },
  },
};
</script>

<template>
  <h1>{{ msg }}</h1>

  <p>
    Recommended IDE setup:
    <a href="https://code.visualstudio.com/" target="_blank">VS Code</a>
    +
    <a href="https://github.com/johnsoncodehk/volar" target="_blank">Volar</a>
  </p>

  <p>
    <a href="https://vitejs.dev/guide/features.html" target="_blank">
      Vite Documentation
    </a>
    |
    <a href="https://v3.vuejs.org/" target="_blank">Vue 3 Documentation</a>
  </p>
  <p>
    <code>
      {{ store.doubleCount }}
    </code>
    <br/>
    <code>
      {{ store.doublePlusOne }}
    </code>
  </p>
  <button type="button" @click="count++">count is: {{ count }}</button>
  <button type="button" @click="test">test</button>
  <p>
    Edit
    <code>components/HelloWorld.vue</code> to test hot module replacement.
  </p>
</template>

<style scoped>
a {
  color: #42b983;
}
</style>
