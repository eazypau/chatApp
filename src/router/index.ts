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
      },
    ],
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

export default router;

//* need to resolve router guard
router.beforeEach((to, from, next) => {
  onAuthStateChanged(auth, (user: any) => {
    if (to.name === 'Register' && !user) {
      return next()
    }
    if (to.name === 'ForgotPassword' && !user) {
      return next()
    }
    if (to.name === 'Home' && !user) {
      return next({ name: 'Login' });
    } else {
      next();
    }
  });
});
