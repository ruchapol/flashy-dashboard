import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";

import TimelineView from "../views/TimelineView.vue";
import CreateView from "../views/CreateView.vue";
import PostDetailView from "../views/PostDetailView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";

const routes: RouteRecordRaw[] = [
  { path: "/", name: "timeline", component: TimelineView },
  { path: "/create", name: "create", component: CreateView },
  { path: "/post/:id", name: "post-detail", component: PostDetailView, props: true },
  { path: "/login", name: "login", component: LoginView },
  { path: "/register", name: "register", component: RegisterView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});

