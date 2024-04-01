import { createRouter, createWebHistory } from 'vue-router'
import store from '@/store';
import GF from '@/utils/GlobalFunctions';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        title: 'Dashboard',
        requiresAuth: true
      },
      component: () => import('@/views/DashboardView.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        title: 'Login'
      },
      component: () => import('@/views/LoginView.vue')
    },
    {
      path: '/video',
      name: 'video',
      meta: {
        title: 'Video List',
        requiresAuth: true,
      },
      component: () => import('@/views/VideoListView.vue')
    },
  ]
})

router.beforeEach((to, from, next) => {
	if(to.path != '/login'){
		store.dispatch('userStore/checkToken');
	}
	if (to.path === '/login' && store.getters['userStore/isLoggedIn']) {
		next('/');
	} else if (to.meta.requiresAuth && !store.getters['userStore/isLoggedIn']) {
		next('/login');
		GF.customToast(0, store.getters['languageStore/translate']('Please login first!'));
	} else {
		next();
	}
});

export default router
