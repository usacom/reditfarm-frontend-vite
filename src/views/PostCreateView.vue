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
} from "element-plus";

import { Edit, Picture, Upload } from "@element-plus/icons-vue";

import { mapState, mapWritableState } from "pinia";

import { useMainStore, useUserStore, usePostStore } from "@/stores";
import PostCreateStepOne from "@/components/PostCreateSteps/PostCreateStepOne.vue";
import PostCreateStepTwo from "@/components/PostCreateSteps/PostCreateStepTwo.vue";
import PostCreateStepThree from "@/components/PostCreateSteps/PostCreateStepThree.vue";
import PostCreateStepFour from "@/components/PostCreateSteps/PostCreateStepFour.vue";

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
    PostCreateStepOne,
    PostCreateStepTwo,
    PostCreateStepThree,
    PostCreateStepFour,
  },
  setup() {
    const postStore = usePostStore();
    return {
      postStore,
      Edit,
      Picture,
      Upload,
    };
  },
  data() {
    return {
      stepActive: 0,
      countStep: 3,
      // posts: [],
    };
  },
  computed: {},
  mounted() {
    // this.loadScheduledPosts();
  },
  methods: {
    nextStep() {
      console.log("nextStep");
      this.stepActive = this.stepActive + 1;
    },
    backStep() {
      if(this.stepActive > 0){
        console.log("nextStep");
        this.stepActive = this.stepActive - 1;
      }
    },
  },
};
</script>
<template>
  <el-row>
    <el-col :span="22" :push="1" style="margin: 10px 0">
      <el-card :body-style="{ padding: '0px' }" style="text-align: left">
        <template #header>
          <el-steps
            :active="stepActive"
            finish-status="success"
            simple
            style="margin-top: 20px"
          >
            <el-step
              v-for="step in countStep"
              :key="step"
              :title="`Step ${step}`"
            />
          </el-steps>
        </template>
        <PostCreateStepOne v-if="stepActive === 0" @next="nextStep"/>
        <PostCreateStepTwo v-if="stepActive === 1" @next="nextStep" @back="backStep"/>
        <PostCreateStepThree v-if="stepActive === 2" @next="nextStep" @back="backStep"/>
        <PostCreateStepFour v-if="stepActive === 3" @next="nextStep" @back="backStep"/>
        <!-- <div v-if="stepActive === 3">test 3</div> -->
        <div>
          <!-- <el-button v-if="stepActive !== 3" @click="nextStep">Next</el-button> -->
        </div>
      </el-card>
    </el-col>
  </el-row>
</template>
