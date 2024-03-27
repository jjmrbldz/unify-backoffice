import './assets/css/style.scss'
import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css'
import '@mdi/font/css/materialdesignicons.min.css'

import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import router from './router'

import PrimeVue from 'primevue/config'
import DialogService from 'primevue/dialogservice'
import DynamicDialog from 'primevue/dynamicdialog'
import IconField from 'primevue/iconfield';
import InputIcon from 'primevue/inputicon';

import GF from '@/utils/GlobalFunctions'
import MODAL from '@/components/Modals'

import StatusTag from '@/components/GlobalComponents/StatusTag.vue'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(PrimeVue, { ripple: true })
app.use(DialogService);
app.component('DynamicDialog', DynamicDialog)
app.component('IconField', IconField)
app.component('InputIcon', InputIcon)
app.component('StatusTag', StatusTag)

app.config.globalProperties.$GF = GF; // GlobalFunctions.js
app.config.globalProperties.$modalComponent = MODAL;

app.mount('#app')
