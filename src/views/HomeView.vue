<template>
  <div class="home">
    <!-- <img alt="Vue logo" src="../assets/logo.png"> -->
    <UserStatusComponent />
  </div>
</template>

<script>
// @ is an alias to /src
import UserStatusComponent from "@/components/UserStatusComponent.vue";

export default {
  name: "HomeView",
  components: {
    UserStatusComponent,
  },
};
</script>
