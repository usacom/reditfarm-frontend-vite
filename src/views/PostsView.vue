<script>
import {
  ElNotification,
  ElCard,
  ElRow,
  ElCol,
  ElBadge,
  ElLink,
  ElIcon,
} from "element-plus";

import { ArrowUp, ArrowDown } from "@element-plus/icons-vue";

import { mapState, mapWritableState } from "pinia";

import { useMainStore, useUserStore, usePostStore } from "@/stores";

export default {
  components: {
    ElRow,
    ElCol,
    ElCard,
    ElBadge,
    ElLink,
    ElIcon,
    ArrowUp,
    ArrowDown,
  },
  setup() {
    const postStore = usePostStore();
    return {
      postStore,
    };
  },
  data() {
    return {
      posts: [],
    };
  },
  computed: {},
  mounted() {
    this.loadPosts();
  },
  methods: {
    async loadPosts() {
      const result = await this.postStore.loadPosts();
      result
        .ok((responce) => {
          this.posts = responce;
        })
        .error((error) => {
          ElNotification({
            title: "Error",
            message: error,
            type: "error",
          });
        });
    },
    printSubName(sub) {
      if (sub.indexOf("u_") === 0) {
        return sub.replace("u_", "");
      }
      return `r/${sub}`;
    },
  },
};
</script>
<template>
  <el-row>
    <el-col :push="1" :span="22" v-for="post in posts" style="margin: 10px 0">
      <el-card :body-style="{ padding: '0px' }" style="text-align: left">
        <template #header>
          <el-row>
            <el-col :span="2" style="display: flex;">
              <div style="margin: 0 4%">
                <div>
                  <el-icon>
                    <ArrowUp />
                  </el-icon>
                </div>
                <div>
                  <el-icon>
                    <ArrowDown />
                  </el-icon>
                </div>
              </div>
              <div>
                <h2 style="margin: 20% 0">
                  {{ post.score }}
                </h2>
              </div>
            </el-col>
            <el-col :span="22">
              <span>{{ printSubName(post.subreddit) }} </span>
              <h3>{{ post.title }}</h3>
              <el-link type="primary" :href="post.url" target="_blank">{{
                post.url
              }}</el-link>
            </el-col>
          </el-row>
        </template>
        <div style="padding: 14px">
          <el-image style="width: 100%" lazy :src="post.url" />
          <p>{{ post.selftext }}</p>
          <code>
            {{ post }}
          </code>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
