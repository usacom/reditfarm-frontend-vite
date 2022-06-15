import { createPinia } from "pinia";
import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/display.css'

import App from "./App.vue";
import router from "./router";
import { useUserStore } from "@/stores/user";

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(ElementPlus);
app.use(router);
app.mount("#app");

const userStore = useUserStore();
userStore.loadLoginData();
