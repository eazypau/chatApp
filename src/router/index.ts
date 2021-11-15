import { createRouter, createWebHistory } from 'vue-router';
import { getCurrentUser } from '../firebase/firebase';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { requireAuth: true },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
  },
  {
    path: '/test',
    name: 'Test',
    component: () => import('../views/Test.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

//* reference: https://garywoodfine.com/how-to-implement-navigation-guards-vue/
//* service session reference: https://firebase.google.com/docs/auth/web/service-worker-sessions
// https://dev.to/gautemeekolsen/vue-guard-routes-with-firebase-authentication-f4l
// https://medium.com/@gaute.meek/vue-guard-routes-with-firebase-authentication-7a139bb8b4f6
router.beforeEach(async (to, from, next) => {
  // const user = auth.currentUser;
  const authStatus = await getCurrentUser();
  if (to.matched.some((route) => route.meta.requiresAuth)) {
    console.log(authStatus);
    if (authStatus) {
      next();
    } else {
      next({ path: '/login' });
    }
  }
  next();
});

export default router;
