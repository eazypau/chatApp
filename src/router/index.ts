import { createRouter, createWebHistory } from "vue-router";
import { getCurrentUser } from "../firebase/firebase";

const routes = [
  {
    path: "/",
    name: "Home",
    component: () => import("../views/Home.vue"),
    meta: { requireAuth: true },
  },
  {
    path: "/login",
    name: "Login",
    component: () => import("../views/Login.vue"),
  },
  {
    path: "/register",
    name: "Register",
    component: () => import("../views/Register.vue"),
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: () => import("../views/ForgotPassword.vue"),
  },
  {
    path: "/:pathMatch(.*)*",
    name: "NotFound",
    component: () => import("../views/NotFound.vue"),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//* reference: https://dev.to/gautemeekolsen/vue-guard-routes-with-firebase-authentication-f4l
router.beforeEach(async (to, from, next) => {
  const authStatus = await getCurrentUser();
  const requireAuth = to.matched.some((route) => route.meta.requireAuth);
  if (requireAuth && !authStatus) {
    next({ path: "/login" });
  } else {
    next();
  }
});

export default router;
