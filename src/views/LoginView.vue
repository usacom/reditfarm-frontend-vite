<script>
import {
  ElButton,
  ElForm,
  ElFormItem,
  ElInput,
  ElRow,
  ElCol,
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
      menu: mainStore.menu,
      userStore,
    };
  },
  data() {
    return {
      form: {
        login: "",
        password: "",
      },
    };
  },
  computed: {
    rules() {
      return {
        login: [{ validator: this.validateLogin, trigger: "blur" }],
        password: [{ validator: this.validatePass, trigger: "blur" }],
      };
    },
  },
  methods: {
    validateLogin(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please input the login"));
      } else {
        callback();
      }
    },
    validatePass(rule, value, callback) {
      if (value === "") {
        callback(new Error("Please input the password"));
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
          this.startLogin();
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
    async startLogin() {
      const status = await this.userStore.loginUser(
        this.form.login,
        this.form.password
      );
      if (status) {
        this.$router.go();
      }
    },
  },
};
</script>
<template>
  <el-row :gutter="20">
    <el-col :span="12" :offset="6">
      <h1>Login page</h1>
      <el-form
        ref="ruleFormRef"
        :model="form"
        status-icon
        :rules="rules"
        label-width="120px"
        class="demo-ruleForm"
      >
        <el-form-item label="Login" prop="login">
          <el-input v-model="form.login" type="login" autocomplete="off" />
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input
            v-model="form.password"
            type="password"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm('ruleFormRef')">
            Login
          </el-button>
          <el-button @click="resetForm('ruleFormRef')">Clear</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>
