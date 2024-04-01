<template>
	<Header v-if="isLoggedIn" />
	<Sidebar v-if="isLoggedIn" />
	<main :class="isLoggedIn && this.$route.path !== '/login' ? 'main min-h-screen' : ''">
		<PageTitle v-if="isLoggedIn" />
		<RouterView />
	</main>
	<Toast />
	<DynamicDialog />
</template>


<script>
import { RouterLink, RouterView } from 'vue-router'
import Header from '@/components/Header.vue'
import Sidebar from '@/components/Sidebar.vue'
import PageTitle from '@/components/GlobalComponents/PageTitle.vue'
import lightThemeStore from '@/store/theme'
import { mapGetters } from 'vuex'

export default {
	data() {
		return {
			// isLoggedIn: true
		}
	},
	mounted() {
		console.log(this.$store);
		this.handleLang()
		this.handleTheme()
	},
	computed:{
		...mapGetters('userStore', ['isLoggedIn'])
	},
	methods: {
		
		handleTheme() {
			if(this.$store.state.lightThemeStore.lightTheme) {
				this.$store.dispatch('lightThemeStore/setLightTheme', true)
				this.$primevue.changeTheme('aura-dark-purple', 'aura-light-purple', 'theme-link', () => {})
			} else {
				this.$store.dispatch('lightThemeStore/setLightTheme', false)
				this.$primevue.changeTheme('aura-light-purple', 'aura-dark-purple', 'theme-link', () => {})
			}
		},
		handleLang() {
			let lang = localStorage.getItem('lang')
			let languages = ["en", "kr", "cn", "vn", "jp", "la"]

			console.log('Lang: ', lang);
			if (lang !== null && lang !== undefined && lang !== '') {
				console.log('lang is not null or undefined');
				if (lang !== "undefined" && lang !== "null") {
					console.log('lang is not string null or undefined');
					if(this.$GF.isJSONString(lang)) {
						lang = JSON.parse(lang)
						if (languages.indexOf(lang) !== -1) {
							console.log('lang is found in languages');
							this.$store.dispatch('languageStore/setLang', lang)
						} else {
							console.log('lang is not found in languages, setting language to default');
							this.$store.dispatch('languageStore/setLang', 'kr')
						}
					} else {
						lang = JSON.stringify(lang)
						if (languages.indexOf(lang) !== -1) {
							console.log('lang is found in languages');
							this.$store.dispatch('languageStore/setLang', lang)
						} else {
							console.log('lang is not found in languages, setting language to default');
							this.$store.dispatch('languageStore/setLang', 'kr')
						}
					}
				} else {
					console.log('lang is string null or undefined, setting language to default');
					this.$store.dispatch('languageStore/setLang', 'kr')
				}
			} else {
				console.log('lang is null, undefined, or empty, setting language to default');
				this.$store.dispatch('languageStore/setLang', 'kr')
			}
		}
	},
	components: {
		Header,
		Sidebar,
		PageTitle
	},
}
</script>