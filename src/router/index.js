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
			path: '/mypage',
			name: 'mypage',
			meta: {
				title: 'MY PAGE',
				requiresAuth: true,
			},
			component: () => import('@/views/MyPageView.vue')
		},
		{
			path: '/newagent',
			name: 'newagent',
			meta: {
				title: 'New Agent',
				requiresAuth: true,
			},
			component: () => import('@/views/NewAgentView.vue')
		},
		{
			path: '/agent/:subAgent',
			name: 'agent',
			meta: {
				title: 'AGENT DETAILS',
				requiresAuth: true,
			},
			component: () => import('@/views/AgentPageView.vue')
		},
		{
			path: '/list',
			meta: {
				requiresAuth: true,
			},
			children : [
				{
					path: 'agent',
					meta: {
						title: 'Agent List',
					},
					component: () => import('@/views/AgentTreeView.vue')
				},
				{
					path: 'user',
					meta: {
						title: 'User List',
					},
					component: () => import('@/views/UserListView.vue')
				},
				{
					path: 'revenue/myrevenue',
					meta: {
						title: 'My Revenue List',
					},
					component: () => import('@/views/MyRevenueView.vue')
				},
				{
					path: 'revenue/loweragent',
					meta: {
						title: 'Lower Agent Revenue List',
					},
					component: () => import('@/views/LowerAgentRevenueView.vue')
				},
				{
					path: 'revenue/bygame',
					meta: {
						title: 'Revenue List by Game',
					},
					component: () => import('@/views/ByGameRevenueView.vue')
				},
			]
		},
		{
			path: '/history',
			meta: {
				requiresAuth: true,
			},
			children : [
				{
					path: 'credit',
					meta: {
						title: 'Credit History List',
					},
					component: () => import('@/views/CreditHistoryView.vue')
				},
				{
					path: 'errorcredit',
					meta: {
						title: 'Error Credit History List',
					},
					component: () => import('@/views/ErrorSportCreditListView.vue')
				},
				{
					path: 'bet',
					meta: {
						title: 'Betting History List',
					},
					component: () => import('@/views/BettingHistoryView.vue')
				},
				{
					path: 'betmarket',
					meta: {
						title: 'Bet History - By Sport Market',
					},
					component: () => import('@/views/BetHistoryByMarketView.vue')
				},
			]
		},
		{
			path: '/settings',
			meta: {
				requiresAuth: true,
			},
			children : [
				{
					path: 'vendor',
					meta: {
						title: 'Vendor Settings',
					},
					component: () => import('@/views/VendorSettingsView.vue')
				},
				{
					path: 'vendorlimit',
					meta: {
						title: 'Vendor Betting Limit',
					},
					component: () => import('@/views/VendorLimitSettingsView.vue')
				},
			]
		},
		{
			path: '/apidocumentation',
			meta: {
				requiresAuth: true,
				title: 'API Documentation',
			},
			component: () => import('@/views/APIDocumentationView.vue')
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
