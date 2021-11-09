import { onAuthStateChanged } from '@firebase/auth';
import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '../firebase/firebase';

const routes = [
  {
    path: '/',
    component: () => import('../layouts/default.vue'),
    children: [
      {
        path: '/',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requireAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: { requireAuth: false },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue'),
    meta: { requireAuth: false },
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue'),
    meta: { requireAuth: false },
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

export default router;

//* need to resolve router guard
// router.beforeEach((to, from, next) => {
//   const user = auth.currentUser
//   if (to.meta.requireAuth) {
//     if (user) {
//     next()
//     }
//   } else {
//     next()
//   }
// });
