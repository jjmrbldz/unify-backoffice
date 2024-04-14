<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('searchByLang') }}</label>
            <PartnerSelect v-model="params.filter_agentid" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('providerLang') }}</label>
            <GameSelect v-model="params.filter_game_id" />
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
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.details ? JSON.parse(data.details).username : '-' }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.txid }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Game Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <span>{{ data.game_type }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Table ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.table_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.type === 'credit'" severity="danger" :value="$store.getters['languageStore/translate'](`creditLang`)"></Tag>
                <Tag v-else severity="info" :value="$store.getters['languageStore/translate'](`debitLang`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" class="text-right" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatTwoDecimal(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 1" severity="success" :value="$store.getters['languageStore/translate'](`NORMAL`)"></Tag>
                <Tag v-else severity="danger" :value="$store.getters['languageStore/translate'](`FAILED`)"></Tag>
            </template>
        </Column>
        <Column v-if="$route.query.bettype === 'sport'" :header="this.$store.getters['languageStore/translate'](`actionLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <Button icon="mdi mdi-eye" severity="info" :label="$store.getters['languageStore/translate'](`detailLang`)" @click="showBetDetails(data)" />
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

export default {
    data() {
        return {
            currDate    : new Date(),
            totalCount: null,
            rowData : {},
            loading : false,
            list    : [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_game_id  : 'evo',
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
        'params.filter_game_id'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
        '$route'(query) {
            console.log(query);
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        showBetDetails(data) {
            const _data     = data;
            const details   = JSON.parse(data.details);
            console.log(_data, details);

            this.$dialog.open(this.$modalComponent.BetDetails, {
                props: {
                    header: `${this.$store.getters['languageStore/translate'](`detailLang`)} - ${details.username}`,
                    style: {
                        width: '70vw'
                    },
                    modal: true,
                    maximizable: true,
                    dismissableMask: true,
                },
                data: {
                    betData     : _data,
                    betDetails  : details,
                },
                onClose: (options) => {
                    // this.getList();
                }
            });
        },
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
                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username
                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;
                
                const res   = await api.recordHistoryList(this.params);
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