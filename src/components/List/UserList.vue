<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-3">
            <label>{{ $store.getters['languageStore/translate']('searchLang') }}</label>
            <InputText type="search" v-model="params.filter_agentid" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Parent Agent ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_parent }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_user_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Current Holding Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_balance }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Today Betting Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.todayBetting }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Registered Date Time`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.tu_reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Last Login Date Time`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.getDateTime(data.tu_last_login) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Last Login IP`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_last_ip }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.tu_status" />
            </template>
        </Column>
        <template #empty> <div class="text-center text-danger"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            rowData : {},
            loading : false,
            list    : [],
            expandedKeys: {},
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                page            : 1,
                items_count     : 10,
                filter_agentid  : '',
                filter_user_id  : '',
                filter_username : '',
            }
        }
    },
    watch: {
        'params.filter_agentid'(newVal, oldVal) {
            if(newVal) {

            } else {
                this.params.filter_agentid = this.$store.state.userStore.username
                this.getList()
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async getList() {
            this.loading = true
            try {

                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                const res   = await api.userList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
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