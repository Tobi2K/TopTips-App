import { createRouter, createWebHistory } from "@ionic/vue-router";
import { RouteRecordRaw } from "vue-router";
import MainTabs from "../views/Tabs.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("@/views/Register.vue"),
  },
  {
    path: "/tabs/",
    component: MainTabs,
    children: [
      {
        path: "",
        redirect: "/tabs/play",
      },
      {
        path: "play",
        component: () => import("@/views/Play.vue"),
      },
      {
        path: "score",
        component: () => import("@/views/Score.vue"),
      },
      {
        path: "group",
        component: () => import("@/views/Group.vue"),
      },
    ],
  },
  {
    path: "/settings/",
    name: "Settings",
    component: () => import("@/views/Settings.vue"),
  },
  {
    path: "/country/",
    name: "Choose Country",
    component: () => import("@/views/ChooseCountry.vue"),
    props: true,
  },
  {
    path: "/competition/:country",
    name: "Choose Competition",
    component: () => import("@/views/ChooseCompetition.vue"),
    props: true,
  },
  {
    path: "/season/:competition",
    name: "Choose Season",
    component: () => import("@/views/ChooseSeason.vue"),
    props: true,
  },
  {
    path: "/create/:season",
    name: "Create Group",
    component: () => import("@/views/CreateGroup.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
