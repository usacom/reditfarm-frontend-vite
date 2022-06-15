<script>
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
  ElNotification,
} from "element-plus";

import { mapState, mapWritableState } from "pinia";

import { useMainStore, useUserStore } from "@/stores";

export default {
  components: {
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElRow,
    ElCol,
  },
  setup() {
    const mainStore = useMainStore();
    const userStore = useUserStore();
    return {
      username: userStore.username,
      isLogined: userStore.isLogined,
      loading: mainStore.loading,
      userStore,
    };
  },
  data() {
    return {
      form: {
        password: "",
        checkPassword: "",
      },
    };
  },
  computed: {
    authCode() {
      return this.$route.query.code;
    },
    rules() {
      return {
        password: [{ validator: this.validatePass, trigger: "blur" }],
        checkPassword: [{ validator: this.checkPassword, trigger: "blur" }],
      };
    },
  },
  methods: {
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else {
        callback();
      }
    },
    checkPassword(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please input the password"));
      } else if (value !== this.form.password) {
        callback(new Error("Password not same"));
      } else {
        callback();
      }
    },
    submitForm(ref) {
      const formEl = this.$refs[ref];
      if (!formEl) return;
      formEl.validate((valid) => {
        if (valid) {
          console.log("submit!");
          this.startReg();
        } else {
          console.log("error submit!");
          return false;
        }
      });
    },
    resetForm(ref) {
      const formEl = this.$refs[ref];
      if (!formEl) return;
      formEl.resetFields();
    },
    async startReg() {
      const result = await this.userStore.registerUser(
        this.authCode,
        this.form.password
      );
      result
        .ok((username) => {
          this.startLogin(username);
        })
        .error((error) => {
          console.log("startReg", error);
          ElNotification({
            title: "Error",
            message: error,
            type: "error",
          });
        });
    },
    async startLogin(username) {
      const result = await this.userStore.loginUser(
        username,
        this.form.password
      );
      result
        .ok((status) => {
          if (status) {
            this.$router.go();
          }
        })
        .error((error) => {
          console.log("startLogin", error);
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
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <h1>Register page</h1>
      <el-form
        ref="ruleFormRef"
        :model="form"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item label="Repat password" prop="checkPassword">
          <el-input
            v-model="form.checkPassword"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button v-loading.fullscreen.lock="loading" type="primary" @click="submitForm('ruleFormRef')">
            Register
          </el-button>
          <el-button @click="resetForm('ruleFormRef')">Clear</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
