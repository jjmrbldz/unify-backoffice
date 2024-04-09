import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddDeductBalance : defineAsyncComponent(() => import('./AddDeductBalanceModal/AddDeductBalanceModal.vue')),
}

export default MODAL