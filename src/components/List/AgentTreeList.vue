<template>
    <TreeTable v-model:expandedKeys="expandedKeys" :value="list" :indentation="0.425" :resizableColumns="false" columnResizeMode="expand"  :loading="loading">
            <!-- <Column field="id" header="ID" :expander="true"></Column> -->
            <Column :header="$store.getters['languageStore/translate']('Up Agent ID')" :expander="true" style="width: 300px; min-width: 300px;" class="not-col">
                <template #body="slotProps">
                    <span class="">
                        {{ slotProps.node.data.id }}
                    </span>
                    <Tag class="mx-2" :severity="this.$GF.handleLevelColor(slotProps.node.data.tp_grade)" :value="`Level ${slotProps.node.data.tp_grade}`" />
                    <span>{{ slotProps.node.data.parent_username }}</span>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Agent ID')">
                <template #body="slotProps">
                    <div class="flex align-items-center">
                        <Badge class="block" value="" :severity="slotProps.node.data.tp_status ? 'warning' : 'success'"></Badge>
                        <span class="ml-1 text-wrap block" style="word-break: break-all;">{{ slotProps.node.data.username }}</span>
                    </div>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Current Holding Amount')">
                <template #body="slotProps">
                    {{ this.$GF.formatTwoDecimal(slotProps.node.data.realCash) }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Fee Rate')">
                <template #body="slotProps">
                    {{ this.$GF.formatTwoDecimal(slotProps.node.data.tp_share) }}%
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Number of Users')">
                <template #body="slotProps">
                    <span class="mdi mdi-account-multiple mr-2"></span>
                    {{ slotProps.node.data.userCount }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Registered Date Time')">
                <template #body="slotProps">
                    {{ this.$GF.getDateTime(slotProps.node.data.tp_reg_datetime) }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Action')">
                <template #body="slotProps">
                   
                </template>
            </Column>
            <!-- <Column field="tp_balance" :header="$store.getters['languageStore/translate']('balanceLang')"></Column>
            <Column field="tp_slot_share" :header="$store.getters['languageStore/translate']('slotShareLang')">
                <template #body="slotProps">
                    {{ parseFloat(slotProps.node.data.tp_slot_share*100).toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 2}) }}%
                </template>
            </Column>
            <Column field="userCount" :header="$store.getters['languageStore/translate']('userCountLang')">
                <template #body="slotProps">
                    <i class="fas fa-user text-success"></i>
                    <span class="ms-1">
                        {{ slotProps.node.data.userCount }}
                    </span>
                </template>
            </Column>
            <Column field="tp_reg_datetime" :header="$store.getters['languageStore/translate']('dateRegisteredLang')">
                <template #body="slotProps">
                    {{ getDateTime(slotProps.node.data.tp_reg_datetime) }}
                </template>
            </Column>
            <Column field="tp_last_login" :header="$store.getters['languageStore/translate']('lastLoginLang')">
                <template #body="slotProps">
                    {{ getDateTime(slotProps.node.data.tp_last_login) }}
                </template>
            </Column>
            <Column header="" field="" headerStyle="width: 10rem">
                <template #body="slotProps">
                    <div class="d-flex flex-nowrap">
                        <Button class="btn btn-sm btn-success me-2" @click="userInfoWindow($event, `sub/information?user_account=${slotProps.node.data.username}`)">
                            <i class="fas fa-eye"></i>
                        </Button>
                        <Button class="btn btn-sm btn-primary" @click="userInfoWindow($event, `sub/information?user_account=${slotProps.node.data.username}`)">
                            <i class="fas fa-edit"></i>
                        </Button>
                    </div>
                </template>
            </Column> -->
            <template #empty> <div class="text-center text-danger"> {{ $store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
        </TreeTable>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'

export default {
    data() {
        return {
            loading : false,
            list    : [],
            expandedKeys: {},
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : this.$store.state.userStore.username,
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        collectKeys(obj, result) {
            if (!obj || typeof obj !== 'object') return;
            if (obj.hasOwnProperty('key')) {
                result[obj.key] = true;
            }
            if (Array.isArray(obj)) {
                obj.forEach(item => this.collectKeys(item, result));
            } else {
                Object.values(obj).forEach(val => this.collectKeys(val, result));
            }
        },
        async getList() {
            this.loading = true
            try {
                const res   = await api.agentList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    const sorter = new DynamicParentIdSorter(res.data.data);
                    const sortedData = sorter.sortData();

                    const converter = new NestedConverter(sortedData);
                    const nestedData = converter.getNestedData();
                    this.list = nestedData;
                    this.list.forEach(obj => this.collectKeys(obj, this.expandedKeys))
                    console.log('Converted', this.list);
                    
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