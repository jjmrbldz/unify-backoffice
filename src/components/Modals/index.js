import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddDeductBalance : defineAsyncComponent(() => import('./AddDeductBalanceModal/AddDeductBalanceModal.vue')),
    BetDetails : defineAsyncComponent(() => import('./BetDetailsModal/BetDetailsModal.vue')),
    CasinoBetDetails : defineAsyncComponent(() => import('./CasinoBetDetailsModal/CasinoBetDetailsModal.vue')),
}

export default MODAL