import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'dashboard',
      meta: {
        title: 'Dashboard'
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
        title: 'Video List'
      },
      component: () => import('@/views/VideoListView.vue')
    },
  ]
})

export default router
