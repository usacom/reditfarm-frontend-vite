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
      userFollowSubs: [],
      listSelected: [],
    };
  },
  computed: {
    rules() {
      return {
        where: [{ validator: this.validateWhere, trigger: "blur" }],
      };
    },
    ...mapWritableState(usePostStore, ["createPostForm"]),
    selectedSubredits: {
      get() {
        return this.postStore.selectedSubredits;
      },
      set(val) {
        this.postStore.updateSelectedSubredits(val);
      },
    },
  },
  mounted() {
    this.loadSubredits();
  },
  methods: {
    validateWhere(rule, value, callback) {
      if (value.length === 0) {
        callback(new Error("Please select or input subreddit(s)"));
      } else {
        callback();
      }
    },
    async loadSubredits() {
      const result = await this.subredditStore.loadMySubreddit();
      result
        .ok((responce) => {
          this.userFollowSubs = responce;
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
    submitForm() {
      const formEl = this.$refs.ruleFormRef;
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log("submit!");
          this.$emit(events.next);
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    resetForm() {
      const formEl = this.$refs.ruleFormRef;
      if (!formEl) return;
      formEl.resetFields();
    },
  },
};
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="createPostForm"
    status-icon
    :rules="rules"
    label-width="120px"
  >
    <el-form-item label="Subredits" prop="where">
      <el-select
        v-model="selectedSubredits"
        filterable
        allow-create
        multiple
        placeholder="Select"
        style="width: 100%"
      >
        <el-option
          v-for="item in userFollowSubs"
          :key="item"
          :label="item"
          :value="item"
        />
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button @click="goBack()"> Back </el-button>
      <el-button type="primary" @click="submitForm()"> Next </el-button>
      <el-button @click="resetForm()">Clear</el-button>
    </el-form-item>
  </el-form>
</template>
