<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Agent ID') }}</label>
            <PartnerSelect v-model="params.filter_agentid" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('providerLang') }}</label>
            <GameSelect v-model="params.filter_game_id" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']($route.query.bettype === 'sport' ? 'Purchase ID' : 'Transaction ID') }}</label>
            <InputText type="search" v-model="params.filter_trans_id" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="handleFilterTrans()" />
        </div>
        <template v-if="$route.query.bettype === 'sport'">
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Live or Not') }}</label>
                <IsLiveSelect v-model="params.filter_islive" />
            </div>
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Result') }}</label>
                <ResultSelect v-model="params.filter_status" />
            </div>
        </template>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minData="startDate" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable v-if="$route.query.bettype === 'sport'" :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.user_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reserve ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <span>{{ data.reserveID }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Type`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.betType }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Live?`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.isLive === 1" severity="success" :value="$store.getters['languageStore/translate'](`Live`)"></Tag>
                <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Prematch`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Odds Total`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag severity="secondary" :value="data.oddsTotal"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Winnings`)" style="min-width: 100px">
            <template #body="{ data }">
                <div class="text-xs white-space-nowrap">
                    <span class="text-red-500">{{ this.$store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.betAmount)">{{ this.$GF.formatNumComma(data.betAmount) }}</span>
                </div>
                <div class="text-xs my-1 white-space-nowrap">
                    <span class="text-blue-500">{{ this.$store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.expectedAmount)">{{ this.$GF.formatNumComma(data.expectedAmount) }}</span>
                </div>
                <div class="text-xs white-space-nowrap">
                    <span class="text-green-500">{{ this.$store.getters['languageStore/translate'](`winningAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.winningAmount)">{{ this.$GF.formatNumComma(data.winningAmount) }}</span>
                </div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Result`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 'Opened'" severity="info" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Lost'" severity="danger" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Won'" severity="success" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Canceled'" severity="warning" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Cashout'" severity="primary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Lost'" style="background: color-mix(in srgb, var(--pink-500), transparent 80%); color: var(--pink-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Won'" style="background: color-mix(in srgb, var(--indigo-500), transparent 80%); color: var(--indigo-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else severity="secondary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.cleanString(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column v-if="$route.query.bettype === 'sport'" :header="this.$store.getters['languageStore/translate'](`Bet Details`)" style="min-width: 100px">
            <template #body="{ data }">
                <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'sport')" />
                <Button v-if="data.resultDetails && data.myurl " icon="mdi mdi-send" class="ml-2" severity="success" @click="handleSendResult(data)" />
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>

    <DataTable v-else :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.user_username }}</span>
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
                <span>{{ data.betdetails ? JSON.parse(data.betdetails).table.name : data.table_id }}</span>
            </template>
        </Column>
        <Column v-if="false" :header="this.$store.getters['languageStore/translate'](`Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.type === 'credit'" severity="danger" :value="$store.getters['languageStore/translate'](`creditLang`)"></Tag>
                <Tag v-else severity="info" :value="$store.getters['languageStore/translate'](`debitLang`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatNumComma(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`winningAmountLang`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.winAmount)">{{ this.$GF.formatNumComma(data.winAmount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Win Loss`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.winLose)">{{ this.$GF.formatNumComma(data.winLose) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.cleanString(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.winLose < 0" severity="danger" :value="$store.getters['languageStore/translate'](`Lost`)"></Tag>
                <Tag v-else-if="data.winLose > 0" severity="success" :value="$store.getters['languageStore/translate'](`Won`)"></Tag>
                <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Tie`)"></Tag>
                <!-- <Tag v-if="data.status === 1" severity="success" :value="$store.getters['languageStore/translate'](`NORMAL`)"></Tag>
                <Tag v-else severity="danger" :value="$store.getters['languageStore/translate'](`FAILED`)"></Tag> -->
            </template>
        </Column>
        <Column v-if="false" :header="this.$store.getters['languageStore/translate'](`detailLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag class="capitalize" :severity="data.betStatus === 'done' ? 'success' : data.betStatus === 'waiting' ? 'warning' : 'secondary'" :value="$store.getters['languageStore/translate'](`${data.betStatus}`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Details`)" style="min-width: 100px">
            <template #body="{ data }">
                <Button v-if="data.betdetails" icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'casino')" />
                <Button v-if="data.resultDetails && data.myurl " icon="mdi mdi-send" class="ml-2" severity="success" @click="handleSendResult(data)" />
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
            providerValue: {},
            betType: null,
            totalCount: null,
            rowData : {},
            loading : false,
            list    : [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_trans_id : '',
                filter_game_id  : this.$route.query.filter_game_id,
                filter_startdate: null,
                filter_enddate  : null,
                filter_islive   : null,
                filter_status   : null,
                page            : 1,
                items_count     : 10,
            },
            startDate   : null,
            endDate     : null
        }
    },
    watch: {
        'params.filter_trans_id'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
        },
        'params.filter_agentid'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
        'params.filter_islive'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
        'params.filter_status'(){
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
        'params.filter_game_id'(newVal, oldVal){
            if (newVal === 'bti') {
                this.$router.replace({query: {bettype: 'sport', filter_game_id: newVal}})
            } else if (newVal === '') {
                this.$router.replace({query: {bettype: '', filter_game_id: newVal}})
            } else {
                this.$router.replace({query: {bettype: this.$route.query.bettype === 'sport' ? 'live' : this.$route.query.bettype, filter_game_id: newVal}})
            }
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            // this.getList()
        },
        '$route'(data) {
            console.log('ROUTE',data);
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        async handleSendResult(data) {
            const { myurl, resultDetails } = data

            if(myurl && resultDetails) {
                const reqBody = {
                    Authorization: `Bearer ${TOKEN}`,
                    username    : this.$store.state.userStore.username,
                    token       : this.$store.state.userStore.token,
                    url         : myurl,
                    result      : resultDetails
                }

                let formData = new FormData()

                formData.append('Authorization', reqBody.Authorization)
                formData.append('username', reqBody.username)
                formData.append('token', reqBody.token)
                formData.append('url', reqBody.url)
                formData.append('result', reqBody.result)

                console.log(reqBody);
                try {
                    const res = await api.sendResult(formData)
                    const code  = res.data.status;
                    const msg   = res.data.message;
                    console.log(res.data);

                    if(code == 0) {
                        let _msg = `${res.data.transaction_id} ${res.data.error_code ? res.data.error_code : ''} Balance: ${res.data.balance}`
                        this.$GF.customToast(1, _msg)
                        this.getList()
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                    
                } catch (e) {
                    console.error(e)
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } else {
                this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Match is not finished`))
            }
        },
        handleBetType(type) {
            if (type) {
                if (type === 'mini') {
                    return 'minigame'
                } else if (type === 'sports') {
                    return 'sport'
                } else {
                    return type
                }
            } else {
                return ''
            }
        },
        handleFilterTrans() {
            this.params.page    = 1
            this.startDate      = null
            this.endDate        = null
            this.getList()
        },
        showBetDetails(data, type) {
            const _data     = data;
            const details   = data.betDetails ? JSON.parse(data.betDetails) : null;
            const _details   = data.betdetails ? JSON.parse(data.betdetails) : null;
            console.log(_data, details);

            this.$dialog.open(this.$modalComponent[type === 'sport' ? 'BetDetails' : 'CasinoBetDetails'], {
                props: {
                    header: `${this.$store.getters['languageStore/translate'](`detailLang`)} - ${_data.user_username}`,
                    style: {
                        width: '80vw'
                    },
                    modal: true,
                    maximizable: true,
                    dismissableMask: true,
                },
                data: {
                    betData     : _data,
                    betDetails  : type === 'sport' ? details : _details,
                    loading     : true,
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
                // this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username
                this.params.filter_bettype = this.$route.query.bettype === 'sport' ? undefined : this.$route.query.bettype
                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;

                const res   = await api[`${this.$route.query.bettype === 'sport' ? 'recordHistoryList' : 'betRecord'}`](this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

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