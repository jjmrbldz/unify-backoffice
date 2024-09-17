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
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading" size="small">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)">
            <template #body="{ data }">
                <div>{{ data.user_username }}</div>
                <div class="text-sm text-400">{{ data.cust_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <div>{{ data.trx_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reserve ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <div>{{ data.reserve_id }}</div>
                <div>{{ data.purchase_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash Before`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.cash_before)">{{ this.$GF.formatNumComma(data.cash_before) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatNumComma(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash After`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.cash_after)">{{ this.$GF.formatNumComma(data.cash_after) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 150px">
            <template #body="{ data }">
                <template v-if="JSON.parse(data.response)['status'] === 0">
                    <Tag  severity="success" :value="$store.getters['languageStore/translate'](`Success`)"></Tag>
                </template>
                <template v-else>
                    <Tag severity="danger" :value="$store.getters['languageStore/translate'](`Error`)"></Tag>
                    <div class="text-xs mt-1 ml-1">{{ JSON.parse(data.response)['error_code'] ? JSON.parse(data.response)['error_code'] : JSON.parse(data.response)['message'] }}</div>
                </template>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Balance`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(JSON.parse(data.response)['balance'])">{{ this.$GF.formatNumComma(JSON.parse(data.response)['balance']) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.cleanString(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Details`)" style="min-width: 100px">
            <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                    <!-- <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'sport')" /> -->
                    <Button icon="mdi mdi-send" severity="success" @click="handleSendResult(data, 'sport', true)" />
                    <Button icon="mdi mdi-send-clock" severity="info" @click="handleSendResult(data, 'sport', false)" />
                </div>
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
            loading     : false,
            params      : {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_reserve_id: null,
                filter_startdate: null,
                filter_enddate  : null,
                page            : 1,
                items_count     : 10,
            },
            startDate   : new Date(),
            endDate     : new Date(),
            list: [],
        }
    },
    watch: {
        'params.filter_agentid'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
            this.getList()
        },
    },
    mounted() {
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

                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;

                const reqBody = {
                    Authorization   : `Bearer ${TOKEN}`,
                    username        : this.params.username,
                    token           : this.params.token,
                    filter_agentid  : this.params.filter_agentid,
                    filter_startdate: this.params.filter_startdate,
                    filter_enddate  : this.params.filter_enddate,
                    page            : this.params.page,
                    items_count     : this.params.items_count,
                }

                const res   = await api.errorSportCreditList(reqBody);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

                if(code === 1) {
                    this.list = res.data.data;
                    this.totalCount = res.data.totalCount
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async handleSendResult(data, type, bool) {
            const { myurl, myjson, id } = data

            if(myurl && myjson) {
                const reqBody = {
                    Authorization: `Bearer ${TOKEN}`,
                    username    : this.$store.state.userStore.username,
                    token       : this.$store.state.userStore.token,
                    url         : myurl,
                    result      : myjson,
                    filter_id   : id,
                    send_agent  : bool,
                }

                let formData = new FormData()

                formData.append('Authorization', reqBody.Authorization)
                formData.append('username', reqBody.username)
                formData.append('token', reqBody.token)
                formData.append('url', reqBody.url)
                formData.append('result', reqBody.result)
                formData.append('filter_id', `${reqBody.filter_id}`)
                formData.append('send_agent', reqBody.send_agent)

                console.log(reqBody);
                try {
                    const res = await api.sendResult(formData)
                    const code  = res.data.status;
                    const msg   = res.data.message;
                    console.log(res.data);

                    if(code == 0) {
                        let _msg = `${res.data.transaction_id} ${res.data.error_code ? res.data.error_code : ''} Balance: ${res.data.balance}`
                        this.$GF.customToast(1, _msg)
                        
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                    
                } catch (e) {
                    console.error(e)
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                } finally {
                    this.getList()
                }
            } else {
                this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Match is not finished`))
            }
        },
    }
}
</script>