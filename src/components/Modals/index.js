import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddDeductBalance : defineAsyncComponent(() => import('./AddDeductBalanceModal/AddDeductBalanceModal.vue')),
    BetDetails : defineAsyncComponent(() => import('./BetDetailsModal/BetDetailsModal.vue')),
}

export default MODAL