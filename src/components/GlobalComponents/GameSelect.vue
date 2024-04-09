<template>
    <div class="w-full">
        <Dropdown v-model="gameValue" :showClear="!!gameValue" filter :options="list" optionLabel="casinoName" optionValue="gameCode" :placeholder="$store.getters['languageStore/translate']('providerLang')" class="w-full" :disabled="disabled">
            <template #clearicon="{slotProps, clearCallback}">
                <i class="p-icon p-dropdown-clear-icon mdi mdi-close" @click="customClear(clearCallback)"></i>
            </template>
        </Dropdown>
    </div>
</template>
<script>
import { api, TOKEN } from '@/axios/api';

export default {
    name: 'PartnerSelect',
    data() {
        return {
            selected: null,
            list: [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
            }
        };
    },
    props:{
        modelValue: String,
        disabled: Boolean
    },
    computed: {
        gameValue: {
            get() {
                if(this.modelValue === null) {
                    return ''
                } else {
                    return this.modelValue;
                }
            },
            set(value) {
                console.log(value)
                this.$emit('update:modelValue', value);
            },
        },
    },
    mounted(){
        this.getList();
    },
    methods:{
        customClear(clearCallback) {
            clearCallback();
            this.gameValue = '';
        },
        async getList() {
            this.loading = true
            try {

                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                const res   = await api.myCasinoLsit(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.list = res.data.data;
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
        // handleChange(){
        //     const user = this.list.find(obj => obj.username === this.selected)
        //     // this.$emit('handleUser', user)
        // }
    }
}
</script>
<style>
    
</style>