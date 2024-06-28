<template>
    <div class="w-full">
        <Dropdown v-model="codeIDValue" filter :options="list" optionLabel="codeId" optionValue="codeId" :placeholder="placeholder" class="w-full" :disabled="disabled" :loading="loading" :pt="{input: {onkeydown: handleEscapeKey}}" >
            <template #clearicon="{slotProps, clearCallback}">
                <i class="p-icon p-dropdown-clear-icon mdi mdi-close" @click="customClear(clearCallback)"></i>
            </template>
        </Dropdown>
    </div>
</template>
<script>
import { api, TOKEN } from '@/axios/api';

export default {
    name: 'CodeIDSelect',
    data() {
        return {
            selected: null,
            list: [],
            params      : {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                page            : 1,
                items_count     : 9999
            },
            loading: false
        };
    },
    props:{
        cancelEdit: null,
        modelValue: String,
        placeholder: String,
        disabled: Boolean
    },
    computed: {
        codeIDValue: {
            get() {
                if(this.modelValue === null) {
                    return ''
                } else {
                    return this.modelValue;
                }
            },
            set(value) {
                this.$emit('update:modelValue', value);
            },
        },
    },
    mounted(){
        console.log(this.cancelEdit)
        this.getList();
    },
    methods:{
        handleEscapeKey(event) {
            if(event && event.code === 'Escape') {
                this.cancelEdit()
            }
        },
        customClear(clearCallback) {
            clearCallback();
            this.codeIDValue = '';
        },
        async getList() {
            this.loading = true
            try {

                const res   = await api.getBetLimitList(this.params);
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
    }
}
</script>
<style>
    
</style>