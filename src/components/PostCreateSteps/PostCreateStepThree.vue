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
    rules() {
      return {
        scheduledTime: [
          { required: true, validator: this.validateDate, trigger: "blur" },
        ],
        flair: [
          { required: true, validator: this.validateFlair, trigger: "blur" },
        ],
        title: [
          { required: true, message: "need input are title", trigger: "blur" },
        ],
      };
    },
    ...mapWritableState(usePostStore, ["createPostForm"]),
    singlTitle() {
      return this.createPostForm.singlTitle;
    },
  },
  mounted() {
    this.loadSubreditsInfo();
  },
  methods: {
    validateDate(rule, value, callback) {
      if (value !== null & value <= new Date()) {
        callback(new Error("Please input date more then now"));
      } else {
        callback();
      }
    },
    validateFlair(rule, value, callback) {
      if (value == "" || value == null) {
        callback(new Error("Please select flair"));
      } else {
        callback();
      }
    },
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
    handleDelete(index, row) {
      delete this.createPostForm.where[index];
    },
    showRules(index) {
      let rules = "This sub don't have rules.";
      const result = this.getRules(index);
      if (result !== null) {
        rules = JSON.stringify(result);
      }
      ElMessageBox.alert(rules, "Rules", {
        confirmButtonText: "OK",
      });
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
  },
};
</script>
<template>
  <el-form
    ref="ruleFormRef"
    :model="createPostForm"
    status-icon
    :rules="rules"
    label-width="0"
  >
    <el-table :data="createPostForm.where" style="width: 100%">
      <el-table-column label="Subreddit" prop="subreddit" />
      <el-table-column v-if="!singlTitle" label="Title" prop="title">
        <template #default="scope">
          <el-form-item
            :prop="'where.' + scope.$index + '.title'"
            :rules="rules.title"
          >
            <el-input v-model="scope.row.title" size="small" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Flair" prop="flair">
        <template #default="scope">
          <el-form-item
            v-if="getFlairs(scope.$index) !== null"
            :prop="'where.' + scope.$index + '.flair'"
            :rules="rules.flair"
          >
            <el-select
              v-model="scope.row.flair"
              class="m-2"
              placeholder="Select"
              size="small"
            >
              <el-option
                v-for="item in getFlairs(scope.$index)"
                :key="item.flair_template_id"
                :label="item.flair_text"
                :value="item.flair_template_id"
              />
            </el-select>
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="Scheduled Time" prop="scheduledTime">
        <template #default="scope">
          <el-form-item
            :prop="'where.' + scope.$index + '.scheduledTime'"
            :rules="rules.scheduledTime"
          >
            <el-date-picker
              v-model="scope.row.scheduledTime"
              type="datetime"
              placeholder="Select date and time"
              size="small"
              :disabledDate="dateIsAvailable"
            />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template #default="scope">
          <el-button size="small" @click="showRules(scope.$index, scope.row)">
            Rules
          </el-button>
          <el-button
            size="small"
            type="danger"
            @click="handleDelete(scope.$index, scope.row)"
          >
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-form-item>
      <el-button @click="goBack()"> Back </el-button>
      <el-button type="primary" @click="submitForm()"> Next </el-button>
      <el-button @click="resetForm()">Clear</el-button>
    </el-form-item>
  </el-form>
</template>
