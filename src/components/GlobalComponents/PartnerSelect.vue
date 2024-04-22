<template>
    <div class="w-full">
        <Dropdown v-model="partnerValue" :showClear="!!partnerValue" filter :options="list" optionLabel="username" optionValue="username" :placeholder="$store.getters['languageStore/translate']('selectpartnerLang')" class="w-full" :disabled="disabled">
            <template #value="slotProps">
                <div  v-if="slotProps.value" class="d-flex align-items center" style="gap: 4px;">
                    <span class=""> <span class="">{{ slotProps.value }}</span></span>
                </div>
                <span v-else>
                    {{ slotProps.placeholder }}
                </span>
            </template>
            <template #option="slotProps">
                <div class="d-flex align-items center" style="gap: 4px;">
                    <span class=""> <span class="">{{ slotProps.option.username }}</span></span>
                </div>
            </template>
            <template #clearicon="{slotProps, clearCallback}">
                <i class="p-icon p-dropdown-clear-icon mdi mdi-close" @click="customClear(clearCallback)"></i>
            </template>
        </Dropdown>
    </div>
</template>
<script>
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'

export default {
    name: 'PartnerSelect',
    data() {
        return {
            // selected: null,
            selected: null,
            list: [],
            // params: {
            //     request_id  : store.state.request_id,
            //     user_type   : store.state.user_type,
            //     p_partnerID : store.state.t_partnerID,
            // },
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
        partnerValue: {
            get() {
                if(this.modelValue === null) {
                    return null
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
    // watch: {
    //     'preSelect'() {
    //         if(this.preSelect) {
    //             this.selected = this.preSelect
    //             // this.list = this.list.filter(item => item.user_username !== this.preSelect);
    //         }
    //     },  
    // },

    mounted(){
        this.getList();
    },
    methods:{
        customClear(clearCallback) {
            clearCallback();
            this.partnerValue = null;
        },
        async getList() {
            this.loading = true
            try {

                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                const res   = await api.agentList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))

                    const sorter = new DynamicParentIdSorter(res.data.data);
                    const sortedData = sorter.sortData();                    

                    this.list = sortedData;
                    
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