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
  },
  setup() {
    const mainStore = useMainStore();
    const userStore = useUserStore();
    const isDark = useDark();
    const toggleDark = useToggle(isDark);
    return {
      username: userStore.username,
      menu: mainStore.menu,
      isLogined: mainStore.isLogined,
      isDark,
      toggleDark,
      Moon,
      Sunny,
    };
  },
  methods: {
    // goToLogin(){
    //   this.$
    // },
  },
};
</script>
<template>
  <el-container class="layout-container-base" style="height: 100vh">
    <el-aside width="200px">
      <el-scrollbar>
        <el-menu :default-openeds="['1', '3']">
          <el-menu-item index="0">
            <template #title> Reddit farm </template>
          </el-menu-item>
          <el-sub-menu index="1">
            <template #title>
              <el-icon><postcard /></el-icon>Posts
            </template>
            <el-menu-item index="1-1">Schedule</el-menu-item>
            <el-menu-item index="1-2">Posted</el-menu-item>
            <el-menu-item index="1-2">Create</el-menu-item>
          </el-sub-menu>
          <el-sub-menu index="3">
            <template #title>
              <el-icon><setting /></el-icon>Navigator Three
            </template>
            <el-menu-item index="3-1">Option 1</el-menu-item>
            <el-menu-item index="3-2">Option 2</el-menu-item>
          </el-sub-menu>
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
          />
          <!-- <button @click="toggleDark()">Is Dark: {{ isDark }}</button> -->
          <router-link
            v-if="!isLogined"
            to="/login"
            custom
            v-slot="{ navigate }"
          >
            <el-button @click="navigate" type="primary" plain>Login</el-button>
          </router-link>
          <el-dropdown v-if="isLogined">
            <el-icon style="margin-right: 8px; margin-top: 1px"
              ><setting
            /></el-icon>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>Profile</el-dropdown-item>
                <el-dropdown-item>Logout</el-dropdown-item>
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

  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link> |
    <router-link to="/login">Login</router-link> |
  </nav> -->
  <!-- <router-view /> -->
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
<style scoped>
.layout-container-base .el-header {
  position: relative;
  background-color: var(--el-color-primary-light-7);
  color: var(--el-text-color-primary);
}
.layout-container-base .el-aside {
  color: var(--el-text-color-primary);
  background: var(--el-color-primary-light-8);
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
