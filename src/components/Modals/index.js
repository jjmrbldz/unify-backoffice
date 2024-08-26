import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddDeductBalance : defineAsyncComponent(() => import('./AddDeductBalanceModal/AddDeductBalanceModal.vue')),
    BetDetails : defineAsyncComponent(() => import('./BetDetailsModal/BetDetailsModal.vue')),
    CasinoBetDetails : defineAsyncComponent(() => import('./CasinoBetDetailsModal/CasinoBetDetailsModal.vue')),
    BetLimit : defineAsyncComponent(() => import('./BetLimitModal/BetLimitModal.vue')),
    AgentBetLimit : defineAsyncComponent(() => import('./AgentBetLimitModal/AgentBetLimitModal.vue')),
    UserRevenueList : defineAsyncComponent(() => import('../List/UserRevenueList.vue')),
    SportResult : defineAsyncComponent(() => import('./SportResultModal/SportResultModal.vue')),
    MarketBetDetails : defineAsyncComponent(() => import('./MarketBetDetailsModal/MarketBetDetailsModal.vue')),
    EventBetDetails : defineAsyncComponent(() => import('./MarketBetDetailsModal/BetByEventName.vue')),
}

export default MODAL