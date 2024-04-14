
<template>
    <div class="jb-menu sidebar card flex fixed m-2">
        <div class="jb-menu-list p-menu">
            <div class="jb-menu-item">
                <router-link v-ripple to="/" class="jb-item-link">
                    <i class="mdi mdi-view-dashboard-outline"></i> 
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('dashboardLang') }}</span> 
                </router-link >
            </div>
            <div class="jb-menu-item">
                <router-link v-ripple to="/mypage" class="jb-item-link">
                    <i class="mdi mdi-account-outline"></i> 
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('myPageLang') }}</span> 
                </router-link >
            </div>
            <div class="jb-menu-item has-submenu">
                <a v-ripple class="jb-item-link" href="#" :class="expand[0] ? 'active' : ''" @click="handleSubmenu('agent', 0, $event)">
                    <i class="pi pi-users"></i>
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('agentLang') }} </span>
                    <span class="pi arrow ml-auto" :class="expand[0] ? 'pi-angle-down' : 'pi-angle-right'" />
                </a>
                <div class="jb-submenu" ref="agent" :class="expand[0] ? 'active' : ''">
                    <router-link v-ripple class="jb-item-link" to="/list/agent">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('agentListLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/list/user">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('userListLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/history/credit">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('creditHistoryLang') }} </span>
                    </router-link>
                </div>
            </div>
            <div class="jb-menu-item has-submenu">
                <a v-ripple class="jb-item-link" href="#" :class="expand[1] ? 'active' : ''" @click="handleSubmenu('games', 1, $event)">
                    <i class="mdi mdi-poker-chip"></i>
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('gamesLang') }} </span>
                    <span class="pi arrow ml-auto" :class="expand[1] ? 'pi-angle-down' : 'pi-angle-right'" />
                </a>
                <div class="jb-submenu" ref="games" :class="expand[1] ? 'active' : ''">
                    <router-link v-ripple class="jb-item-link" :class="this.$route.query.bettype === '' ? 'custom-active' : ''" activeClass="" exactActiveClass="" :to="{path: '/history/bet', query: {bettype: '', filter_game_id: 'evo'}}">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('betHistoryLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" :class="this.$route.query.bettype === 'sport' ? 'custom-active' : ''" activeClass="" exactActiveClass="" :to="{path: '/history/bet', query: {bettype: 'sport', filter_game_id: 'bti'}}">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('Bet History - Sport') }} </span>
                    </router-link>
                    <template v-if="$store.state.userStore.tp_level === 'T'">
                        <router-link v-ripple class="jb-item-link" to="/settings/game">
                            <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('gameSettingsLang') }} </span>
                        </router-link>
                        <router-link v-ripple class="jb-item-link" to="/settings/vendor">
                            <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('vendorSettingsLang') }} </span>
                        </router-link>
                    </template>
                </div>
            </div>
            <div class="jb-menu-item has-submenu">
                <a v-ripple class="jb-item-link" href="#" :class="expand[2] ? 'active' : ''" @click="handleSubmenu('settlement', 2, $event)">
                    <i class="mdi mdi-account-cash-outline"></i>
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('settlementDetailsLang') }} </span>
                    <span class="pi arrow ml-auto" :class="expand[2] ? 'pi-angle-down' : 'pi-angle-right'" />
                </a>
                <div class="jb-submenu" ref="settlement" :class="expand[2] ? 'active' : ''">
                    <router-link v-ripple class="jb-item-link" to="/list/revenue/myrevenue">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('myRevenueListLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/list/revenue/loweragent">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('lowerAgentRevenueListLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/list/revenue/bygame">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('revenueListByGameLang') }} </span>
                    </router-link>
                </div>
            </div>
            <div class="jb-menu-item has-submenu">
                <a v-ripple class="jb-item-link" href="#" :class="expand[3] ? 'active' : ''" @click="handleSubmenu('others', 3, $event)">
                    <i class="mdi mdi-dots-horizontal-circle-outline"></i>
                    <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('othersLang') }} </span>
                    <span class="pi arrow ml-auto" :class="expand[3] ? 'pi-angle-down' : 'pi-angle-right'" />
                </a>
                <div class="jb-submenu" ref="others" :class="expand[3] ? 'active' : ''">
                    <router-link v-ripple class="jb-item-link" to="/history/update">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('updateHistoryLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/apidocumentation">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('apiDocumentationLang') }} </span>
                    </router-link>
                    <router-link v-ripple class="jb-item-link" to="/promotions/notice">
                        <span class="ml-2 fs-6">{{ this.$store.getters['languageStore/translate']('noticeLang') }} </span>
                    </router-link>
                </div>
            </div>
            
        </div>
    </div>
</template>

<style lang="scss" scoped>
.router-link-active, .custom-active {
    border-radius: 4px;
    background-color: var(--highlight-bg); 
    color: var(--highlight-text-color) !important;
}
</style>

<script>
import { RouterLink } from 'vue-router'

export default {
    data() {
        return {
            expand: [false, false, false],
            show: false,
        }
    },
    mounted() {
        var s = setTimeout(() => {
            this.activeLink();
            clearTimeout(s);
        }, 300)
    },
    methods: {
        handleSubmenu(refName, index, $event) {
            $event.preventDefault();
            this.expand[index] = !this.expand[index];
        },
        activeLink() {
            
            var linkItem = document.querySelectorAll('.jb-item-link');

            linkItem.forEach((element, index) => {
                if (element.classList.contains('router-link-active') || element.classList.contains('custom-active') ) {
                    element.parentNode.classList.add('active');
                    const sib = element.parentNode.previousElementSibling;
                    sib.classList.add('active');
                    // console.log(index);
                    // this.expand[index] = !this.expand[index];
                } else {

                }
            });
        }
    },
};

</script>
