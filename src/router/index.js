import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import AboutView from "@/views/AboutView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import PostsView from "@/views/PostsView.vue";
import ProfileView from "@/views/ProfileView.vue";

import { useUserStore } from "@/stores/user";
import auth from "./middleware/auth";
import guest from "./middleware/guest";
import register from "./middleware/register";
import middlewarePipeline from "./middlewarePipeline";
const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
    meta: {
      title: "Home",
      middleware: [register],
    },
  },
  {
    path: "/about",
    name: "about",
    component: AboutView,
    meta: {
      title: "About us",
    },
  },
  {
    path: "/post/posts",
    name: "posts",
    component: PostsView,
    meta: {
      title: "Published posts",
      middleware: [auth],
    },
  },
  {
    path: "/post/scheduled",
    name: "postsScheduled",
    component: PostsView,
    meta: {
      title: "Post scheduled",
      middleware: [auth],
    },
  },
  {
    path: "/post/create",
    name: "postCreate",
    component: PostsView,
    meta: {
      title: "Create post",
      middleware: [auth],
    },
  },
  {
    path: "/profile",
    name: "profile",
    component: ProfileView,
    meta: {
      title: "User profile",
      middleware: [auth],
    },
  },
  {
    path: "/login",
    name: "login",
    component: LoginView,
    meta: {
      title: "Login page",
      middleware: [guest],
    },
  },
  {
    path: "/register",
    name: "register",
    component: RegisterView,
    meta: {
      title: "Register page",
      middleware: [register],
    },
  },
];
const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

router.beforeEach(async (to, from, next) => {
  let title = import.meta.env.VITE_APP_BASE_TITLE;
  if (to.meta.title) {
    title = `${to.meta.title} — ${title}`;
  }
  document.title = title;
  const userStore = useUserStore();
  console.log("userStore.hasKey", userStore.hasKey);
  if (userStore.hasKey) {
    await userStore.loadLoginData();
  }
  if (!to.meta.middleware) {
    return next();
  }
  const store = {
    isLogined: userStore.isLogined,
    username: userStore.username,
  };
  const { middleware } = to.meta;
  const context = {
    to,
    from,
    next,
    store,
  };
  return middleware[0]({
    ...context,
    next: middlewarePipeline(context, middleware, 1),
  });
});

export default router;
