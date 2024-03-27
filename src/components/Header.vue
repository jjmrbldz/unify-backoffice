<template>
    <Menubar class="fixed top-0 m-2 header" style="height: 68px;">
        <template #start>
            <RouterLink class="inline-flex max-h-full align-items-center" to="/">
                <img class="" src="@/assets/img/logo2.svg" alt="" height="40">
                <span class="logo-title ml-2">UNIFY</span>
            </RouterLink>
        </template>
        <template #end>
            <div class="flex align-items-center gap-2">
                <Button icon="pi pi-bell" aria-label="Theme Toggle" rounded text />
                <LanguageToggle />
                <Button :icon="!this.$store.state.lightThemeStore.lightTheme ? 'pi pi-sun' : 'pi pi-moon'" aria-label="Theme Toggle" @click="handleTheme" rounded text />
                <span class="font-light mr-2">|</span>
                <Button icon="pi pi-user" severity="secondary" rounded />
                <Button icon="pi pi-sign-out" aria-label="Logout" rounded text />
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
        }
    },
    components: {
        LanguageToggle
    }
}
</script>