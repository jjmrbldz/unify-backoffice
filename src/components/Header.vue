<template>
    <Menubar class="fixed top-0 m-2 header z-5" style="height: 68px;">
        <template #start>
            <RouterLink class="inline-flex max-h-full align-items-center" to="/">
                <img class="" src="@/assets/img/smartapi-logo.png" alt="" height="40" :style="$store.state.lightThemeStore.lightTheme ? 'filter: contrast(0.6);' : ''">
                <!-- <span class="logo-title ml-2">UNIFY</span> -->
            </RouterLink>
            <div class="navSummary">
                <div class="summItem">
                    <Skeleton v-if="$store.state.userStore.glblLoading" width="80px" />
                    <div v-else class="summContent">{{ this.$GF.formatTwoDecimal($store.state.userStore.realCash) }}</div>
                    <Button class="ml-auto" icon="mdi mdi-refresh" text @click="refresh()"/>
                </div>
            </div>
        </template>
        <template #end>
            <div class="flex align-items-center gap-2">
                <Button icon="pi pi-bell" aria-label="Theme Toggle" rounded text />
                <LanguageToggle />
                <Button :icon="!this.$store.state.lightThemeStore.lightTheme ? 'pi pi-sun' : 'pi pi-moon'" aria-label="Theme Toggle" @click="handleTheme" rounded text />
                <span class="font-light mr-2">|</span>
                <Button icon="pi pi-user" severity="secondary" rounded @click="$router.push({path: '/mypage'})" />
                <Button icon="pi pi-sign-out" aria-label="Logout" @click="this.$store.commit('userStore/logout')" rounded text />
            </div>
        </template>
    </Menubar>
</template>

<script>
import lightThemeStore from '@/store/theme';
import LanguageToggle from '@/components/GlobalComponents/LanguageToggle.vue'

export default {
    data() {
        return {
        }
    },
    mounted() {
    },
    methods: {
        handleTheme() {
            console.log(this.$store.state.lightThemeStore.lightTheme);
            if(this.$store.state.lightThemeStore.lightTheme) {
                this.$primevue.changeTheme('aura-light-purple', 'aura-dark-purple', 'theme-link', () => {})
                this.$store.dispatch('lightThemeStore/setLightTheme', false)
            } else {
                this.$primevue.changeTheme('aura-dark-purple', 'aura-light-purple', 'theme-link', () => {})
                this.$store.dispatch('lightThemeStore/setLightTheme', true)
            }
        },
        refresh() {
            this.$store.dispatch('userStore/agentDetails');
        }
    },
    components: {
        LanguageToggle
    }
}
</script>