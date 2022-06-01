<script>
import {
  ElAlert,
  ElNotification,
  ElCard,
  ElRow,
  ElCol,
  ElBadge,
  ElLink,
  ElIcon,
  ElStep,
  ElSteps,
  ElForm,
  ElFormItem,
  ElPopover,
  ElMessage,
  ElMessageBox,
  ElDatePicker,
} from "element-plus";

import { InfoFilled } from "@element-plus/icons-vue";

import { mapState, mapWritableState } from "pinia";

import {
  useMainStore,
  useUserStore,
  usePostStore,
  useSubredditStore,
} from "@/stores";

const events = {
  next: "next",
  back: "back",
};

export default {
  components: {
    ElAlert,
    ElRow,
    ElCol,
    ElCard,
    ElBadge,
    ElLink,
    ElIcon,
    ElStep,
    ElSteps,
    ElForm,
    ElFormItem,
    ElPopover,
    ElDatePicker,
    InfoFilled,
  },
  setup() {
    const postStore = usePostStore();
    const subredditStore = useSubredditStore();
    return {
      postStore,
      subredditStore,
    };
  },
  data() {
    return {
      subsInfo: [],
      rowEdits: [],
    };
  },
  computed: {
    ...mapWritableState(usePostStore, ["createPostForm"]),
    singlTitle() {
      return this.createPostForm.singlTitle;
    },
    previewForm() {
      return this.postStore.previewForm;
    },
  },
  mounted() {
    this.loadSubreditsInfo();
  },
  methods: {
    async loadSubreditsInfo() {
      const result = await this.subredditStore.loadSelectedSubreditsInfo();
      result
        .ok((responce) => {
          this.subsInfo = responce;
          console.log("responce", responce);
        })
        .error((error) => {
          ElNotification({
            title: "Error",
            message: error,
            type: "error",
          });
        });
    },
    goBack() {
      this.$emit(events.back);
    },
    getInfoByIndex(index) {
      const filtred = this.subsInfo.filter((item) => {
        return item.subreddit === this.createPostForm.where[index].subreddit;
      });
      if (filtred.length !== 0) {
        return filtred[0];
      }
      return null;
    },
    getFlairNameByID(index, id) {
      const result = this.getFlairs(index);
      if (result === null) {
        return "";
      }
      const filtred = result.filter((item) => {
        return item.flair_template_id === id;
      });

      return filtred.length !== 0 ? filtred[0].flair_text : "";
    },
    getFlairs(index) {
      const result = this.getInfoByIndex(index);
      return result && result.flairs && result.flairs.length !== 0
        ? result.flairs
        : null;
    },
    getRules(index) {
      const result = this.getInfoByIndex(index);
      return result && result.rules && result.rules.length !== 0
        ? result.rules
        : null;
    },
    dateIsAvailable(data) {
      return data < new Date();
    },
    async save() {
      console.log("save posts");
      const result = await this.postStore.savePost();
      result
        .ok(() => {
          ElNotification({
            title: "Saved!",
            message: "Post(s) saved",
            type: "success",
          });
          this.$router.push("/post/scheduled");
        })
        .error((error) => {
          ElNotification({
            title: "Error",
            message: error,
            type: "error",
          });
        });
    },
  },
};
</script>
<template>
  <div> 
    <el-row>
      <el-col :push="1" :span="22" v-for="post in previewForm" style="margin: 10px 0">
        <el-card :body-style="{ padding: '0px' }" style="text-align: left">
          <template #header>
            <el-row>
              <el-col :span="24">
                <span>{{ post.subreddit }} </span>
                <h3>{{ post.title }}</h3>
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
            <p>{{ post.content }}</p>
            <code>
              {{ post }}
            </code>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <div style="display: flex; justify-content: center; margin: 10px 0">
      <el-button @click="goBack()"> Back </el-button>
      <el-button @click="save()"> Save </el-button>
    </div>
  </div>
</template>
