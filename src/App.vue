<script>
import {
  ElButton,
  ElContainer,
  ElAside,
  ElScrollbar,
  ElMenu,
  ElSubMenu,
  ElIcon,
  ElLink,
  ElSwitch,
} from "element-plus";
import {
  Menu as IconMenu,
  Postcard,
  Setting,
  Moon,
  Sunny,
  DocumentAdd,
} from "@element-plus/icons-vue";
import { mapState, mapWritableState } from "pinia";
import { useDark, useToggle } from "@vueuse/core";

import { useMainStore, useUserStore } from "@/stores";

export default {
  components: {
    ElButton,
    ElContainer,
    ElAside,
    ElScrollbar,
    ElMenu,
    ElSubMenu,
    ElIcon,
    ElLink,
    ElSwitch,
    IconMenu,
    Postcard,
    Setting,
    DocumentAdd,
  },
  setup() {
    const userStore = useUserStore();
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    return {
      userStore,
      isDark,
      toggleDark,
      Moon,
      Sunny,
    };
  },
  computed: {
    ...mapState(useUserStore, ["username", "isLogined"]),
    ...mapState(useMainStore, ["loading", "menu"]),
    projectName() {
      return import.meta.env.VITE_APP_BASE_TITLE;
    },
  },
  methods: {
    register() {
      this.userStore.authByReddit();
    },
    logout() {
      this.userStore.logout();
      this.$router.go("/");
    },
    profile() {
      this.$router.push("/profile");
    },
  },
};
</script>
<template>
  <el-container v-loading.fullscreen.lock="loading" class="layout-container-base" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu router :collapse="false">
          <el-menu-item index="0" :route="{ name: 'home' }">
            <template #title>
              <el-icon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M24 11.779c0-1.459-1.192-2.645-2.657-2.645-.715 0-1.363.286-1.84.746-1.81-1.191-4.259-1.949-6.971-2.046l1.483-4.669 4.016.941-.006.058c0 1.193.975 2.163 2.174 2.163 1.198 0 2.172-.97 2.172-2.163s-.975-2.164-2.172-2.164c-.92 0-1.704.574-2.021 1.379l-4.329-1.015c-.189-.046-.381.063-.44.249l-1.654 5.207c-2.838.034-5.409.798-7.3 2.025-.474-.438-1.103-.712-1.799-.712-1.465 0-2.656 1.187-2.656 2.646 0 .97.533 1.811 1.317 2.271-.052.282-.086.567-.086.857 0 3.911 4.808 7.093 10.719 7.093s10.72-3.182 10.72-7.093c0-.274-.029-.544-.075-.81.832-.447 1.405-1.312 1.405-2.318zm-17.224 1.816c0-.868.71-1.575 1.582-1.575.872 0 1.581.707 1.581 1.575s-.709 1.574-1.581 1.574-1.582-.706-1.582-1.574zm9.061 4.669c-.797.793-2.048 1.179-3.824 1.179l-.013-.003-.013.003c-1.777 0-3.028-.386-3.824-1.179-.145-.144-.145-.379 0-.523.145-.145.381-.145.526 0 .65.647 1.729.961 3.298.961l.013.003.013-.003c1.569 0 2.648-.315 3.298-.962.145-.145.381-.144.526 0 .145.145.145.379 0 .524zm-.189-3.095c-.872 0-1.581-.706-1.581-1.574 0-.868.709-1.575 1.581-1.575s1.581.707 1.581 1.575-.709 1.574-1.581 1.574z"
                  />
                </svg>
              </el-icon>
              {{ projectName }}
            </template>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><postcard /></el-icon>Posts
            </template>
            <el-menu-item index="1-0" :route="{ name: 'postsScheduled' }">
              Schedule
            </el-menu-item>
            <el-menu-item index="1-1" :route="{ name: 'posts' }">
              Posted
            </el-menu-item>
            <el-menu-item index="1-2" :route="{ name: 'postCreate' }">
              <el-icon><documentAdd /></el-icon> Create
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item index="2" :route="{ name: 'about' }">
            About us
          </el-menu-item>
        </el-menu>
      </el-scrollbar>
    </el-aside>

    <el-container>
      <el-header style="text-align: right; font-size: 12px">
        <div class="toolbar">
          <el-switch
            v-model="isDark"
            @change="toggleDark"
            inline-prompt
            :active-icon="Moon"
            :inactive-icon="Sunny"
            style="margin: 0 12px"
          />
          <el-button v-if="!isLogined" @click="register" type="primary" plain>
            Registration
          </el-button>
          <router-link
            v-if="!isLogined"
            to="/login"
            custom
            v-slot="{ navigate }"
          >
            <el-button @click="navigate" type="primary" plain>Login</el-button>
          </router-link>
          <el-dropdown v-if="isLogined">
            <el-icon style="margin-right: 8px; margin-top: 1px">
              <setting />
            </el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="profile">Profile</el-dropdown-item>
                <el-dropdown-item @click="logout">Logout</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
          <span>{{ username }}</span>
        </div>
      </el-header>

      <el-main>
        <el-scrollbar>
          <router-view />
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<style>
body {
  margin: 0;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--el-text-color-primary);
}
.el-popover {
  --el-popover-bg-color: var(--el-bg-color) !important;
}
</style>
<style scoped>
.layout-container-base .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-8);
  color: var(--el-text-color-primary);
}
.layout-container-base .el-aside {
  background: var(--el-color-primary-light-9);
  color: var(--el-text-color-primary);
}
.layout-container-base .el-menu {
  border-right: none;
}
.layout-container-base .el-main {
  padding: 0;
}
.layout-container-base .toolbar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  right: 20px;
}
</style>
