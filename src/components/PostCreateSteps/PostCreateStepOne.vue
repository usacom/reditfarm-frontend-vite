<script>
import {
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

import { useMainStore, useUserStore, usePostStore } from "@/stores";

const events = {
  next: 'next',
};

export default {
  components: {
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
    return {
      postStore,
    };
  },
  data() {
    return {};
  },
  computed: {
    rules() {
      return {
        title: [{ validator: this.validateTitle, trigger: "blur" }],
        content: [{ validator: this.validateContent, trigger: "blur" }],
      };
    },
    ...mapWritableState(usePostStore, ["createPostForm"]),
  },
  mounted() {},
  methods: {
    validateTitle(rule, value, callback) {
      if (this.createPostForm.singlTitle && value === "") {
        callback(new Error("Please input the title"));
      } else {
        callback();
      }
    },
    validateContent(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please input the content"));
      } else {
        callback();
      }
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
    getLabelContent(){
      if(this.createPostForm.type ==='text'){
        return 'Text';
      }
      if(this.createPostForm.type ==='url'){
        return 'Link';
      }
      return 'content';
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
    <el-form-item label="Singl title?" prop="singlTitle">
      <template #label="{ label }">
        {{ label }}
        <el-popover
          :title="label"
          placement="top"
          trigger="hover"
          content="Disable if you need make couple post with the same content and different titles."
          :width="300"
        >
          <template #reference>
            <el-icon><InfoFilled /></el-icon>
          </template>
        </el-popover>
      </template>
      <el-switch v-model="createPostForm.singlTitle" />
    </el-form-item>
    <el-form-item v-if="createPostForm.singlTitle" label="Title" prop="title">
      <el-input
        v-model="createPostForm.title"
        type="title"
        autocomplete="off"
      />
    </el-form-item>
    <el-form-item label="NSFW" prop="nsfw">
      <el-switch v-model="createPostForm.nsfw" />
    </el-form-item>
    <el-form-item label="Spoiler" prop="spoiler">
      <el-switch v-model="createPostForm.spoiler" />
    </el-form-item>
    <el-form-item label="Type post(s)" prop="type">
      <el-radio-group v-model="createPostForm.type">
        <el-radio label="url">Link</el-radio>
        <el-radio label="text">Text</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item :label="getLabelContent()" prop="content">
      <el-input
        v-if="createPostForm.type ==='text'"
        v-model="createPostForm.content"
        type="textarea"
        autocomplete="off"
        :rows="3"
      />
      <el-input
        v-if="createPostForm.type ==='url'"
        v-model="createPostForm.content"
        type="text"
        autocomplete="off"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm()"> Next </el-button>
      <el-button @click="resetForm()">Clear</el-button>
    </el-form-item>
  </el-form>
</template>
