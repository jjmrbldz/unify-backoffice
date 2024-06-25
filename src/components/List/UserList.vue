<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('Agent ID') }}</label>
            <PartnerSelect v-model="params.filter_agentid" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('searchByLang') }}</label>
            <Dropdown v-model="searchBy" :options="searchByOptions" optionLabel="label" optionValue="value" placeholder="Search by" checkmark :highlightOnSelect="false" class="w-full" @change="handleSearchBy()" />
        </div>
        <div class="field col-2">
            <label>&nbsp;</label>
            <InputText type="search" v-model="searchValue" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="disabled" @keyup.enter="getList()" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <!-- <Column :header="this.$store.getters['languageStore/translate'](`Parent Agent ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_parent }}</span>
            </template>
        </Column> -->
        <Column :header="this.$store.getters['languageStore/translate'](`Agent`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_real_username }}</span>
            </template>
        </Column>
        <!-- <Column :header="this.$store.getters['languageStore/translate'](`Today Betting Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.todayBetting) }}</span>
            </template>
        </Column> -->
        <Column :header="this.$store.getters['languageStore/translate'](`Registered Date Time`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_reg_datetime }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Last Login Date Time`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.tu_last_login }}</span>
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
        <Column :header="this.$store.getters['languageStore/translate'](`Action`)" style="min-width: 100px">
            <template #body="{ data }">
                <Button icon="mdi mdi-eye" severity="info" @click="showUserRevenue(data)" />
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :rows="params.items_count"
        :totalRecords="totalCount"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePagination"
        >
    </Paginator>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            disabled    : true,
            searchBy    : null,
            searchValue : '',
            searchByOptions: [
                // { label: 'Agent ID', value: 'filter_agentid' },
                { label: 'User ID', value: 'filter_username' },
                // { label: '', value: 'filter_username' },
            ],
            totalCount: null,
            rowData : {},
            loading : false,
            list    : [],
            expandedKeys: {},
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_user_id  : '',
                filter_username : '',
                page            : 1,
                items_count     : 10,
            }
        }
    },
    watch: {
        searchValue: {
            handler(newValue, oldValue) {
                // console.log(newValue);
                if(!newValue) {
                    this.params[`${this.searchBy}`] = newValue
                    this.getList()
                }
            }
        },
        'params.filter_agentid'(){
            this.params.page = 1
            this.getList()
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        showUserRevenue(data) {
            this.$dialog.open(this.$modalComponent.UserRevenueList, {
                props: {
                    header: `${this.$store.getters['languageStore/translate'](`User Revenue List`)} - ${data.tu_real_username}`,
                    style: {
                        width: '80vw'
                    },
                    modal: true,
                    maximizable: true,
                    dismissableMask: true,
                },
                data: {
                    userData     : data,
                },
                onClose: (options) => {
                    // this.getList();
                }
            });
        },
        handleSearchBy() {
            this.disabled       = false;
            this.searchValue    = '';
            this.params[`${this.searchBy}`] = this.searchValue
        },
        handlePagination(data) {
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                if(this.searchBy) {
                    this.params[`${this.searchBy}`] = this.searchValue
                }
                // this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                let reqBody = {
                    Authorization   : this.params.Authorization,
                    username        : this.params.username,
                    token           : this.params.token,
                    filter_agentid  : this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username,
                    filter_user_id  : this.params.filter_user_id,
                    filter_username : this.params.filter_username,
                    page            : this.params.page,
                    items_count     : this.params.items_count,
                }

                const res   = await api.userList(reqBody);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data;
                    this.totalCount = res.data.totalCount
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                    this.totalCount = null
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