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
    this.loadScheduledPosts();
  },
  methods: {
    async loadScheduledPosts() {
      const result = await this.postStore.loadScheduledPosts();
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
            <el-col :span="2" style="display: flex">
              {{ post.status }}
            </el-col>
            <el-col :span="22">
              <span>{{ printSubName(post.subreddit) }} </span>
              <h3>{{ post.title }}</h3>
              <el-link
                type="primary"
                :href="`https://reddit.com${post.url}`"
                target="_blank"
              >
                {{ post.url }}
              </el-link>
            </el-col>
          </el-row>
        </template>
        <div style="padding: 14px">
          <el-image
            v-if="post.type === 'url'"
            style="width: 100%"
            lazy
            :src="post.content"
          />
          <p v-else>{{ post.content }}</p>
          <code>
            {{ post }}
          </code>
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
