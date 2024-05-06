<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('Agent ID') }}</label>
            <PartnerSelect v-model="params.filter_agentid" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minData="startDate" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Cash Type`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.ipcf_move_type === 'deduct' ? $store.getters['languageStore/translate']('Withdrawal') : $store.getters['languageStore/translate']('Deposit') }}</span>
            </template>
        </Column>
        <Column :header="`${this.$store.getters['languageStore/translate'](`Agent ID`)} ->`" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_sender_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.ipcf_amount)">{{ this.$GF.formatNumComma(data.ipcf_amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash Before`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.ipcf_cash_before)">{{ this.$GF.formatNumComma(data.ipcf_cash_before) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash After`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.ipcf_cash_after)">{{ this.$GF.formatNumComma(data.ipcf_cash_after) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(data.ipcf_move_date) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`ipAddressLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.ipcf_ipaddr ? data.ipcf_ipaddr : '-' }}</span>
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
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'

export default {
    data() {
        return {
            currDate    : new Date(),
            totalCount: null,
            rowData : {},
            loading : false,
            list    : [],
            agentList: [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_startdate: null,
                filter_enddate  : null,
                page            : 1,
                items_count     : 10,
            },
            startDate   : null,
            endDate     : null
        }
    },
    watch: {
        'params.filter_agentid'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
    },
    mounted() {
        // this.getAgentList()
        this.getList()
    },
    methods: {
        handleDateChange() {
            this.params.page = 1
            this.getPartnerCash()
        },
        handlePagination(data) {
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                // this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username
                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;
                let reqBody = {
                    Authorization   : `Bearer ${TOKEN}`,
                    username        : this.params.username,
                    token           : this.params.token,
                    filter_agentid  : this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username,
                    filter_startdate: this.params.filter_startdate,
                    filter_enddate  : this.params.filter_enddate,
                    page            : this.params.page,
                    items_count     : this.params.items_count,
                }
                const res   = await api.creditHIstoryList(reqBody);
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
        async getAgentList() {
            try {

                let reqBody = {
                    Authorization   : `Bearer ${TOKEN}`,
                    username        : this.$store.state.userStore.username,
                    token           : this.$store.state.userStore.token,
                    filter_agentid  : this.$store.state.userStore.username,
                }

                const res   = await api.agentList(reqBody);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    const sorter = new DynamicParentIdSorter(res.data.data);
                    const sortedData = sorter.sortData();
                    this.agentList = sortedData;
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                console.error(error)
                throw error
            } 
        },
        mapSender(id) {
            const sender = this.agentList.find(i => i.id === id)
            return sender ? sender.username : 'admin'
        }
    }
}
</script>