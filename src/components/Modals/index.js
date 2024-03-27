import { defineAsyncComponent } from 'vue';

const MODAL = {
    AddEditVideo : defineAsyncComponent(() => import('./AddEditVideoModal/AddEditVideoModal.vue')),
}

export default MODAL