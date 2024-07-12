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
            <label>{{ $store.getters['languageStore/translate']('User ID') }}</label>
            <InputText type="search" v-model="params.filter_username" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="handleFilterTrans()" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']($route.query.bettype === 'sport' ? 'Reserve ID' : 'Transaction ID') }}</label>
            <InputText type="search" v-model="params.filter_trans_id" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
        </div>
        <template v-if="$route.query.bettype === 'sport'">
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Purchase ID') }}</label>
                <InputText type="search" v-model="params.filter_purchase_id" class="text-base text-color p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </div>
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Live or Not') }}</label>
                <IsLiveSelect v-model="params.filter_islive" />
            </div>
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Result') }}</label>
                <ResultSelect v-model="params.filter_status" :bet-type="$route.query.bettype" />
            </div>
        </template>
        <template v-else>
            <div class="field col">
                <label>{{ $store.getters['languageStore/translate']('Status') }}</label>
                <ResultSelect v-model="params.filter_status" :bet-type="$route.query.bettype" />
            </div>
        </template>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minDate="startDate" :maxDate="currDate" showIcon iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable v-if="$route.query.bettype === 'sport'" :value="list" scrollable class="mt-4" stripedRows :loading="loading" size="small">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <div>{{ data.partner_username }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 200px">
            <template #body="{ data }">
                <div>{{ data.user_username }}</div>
                <template v-if="data.user_id">
                    <div class="">{{ data.user_id }}</div>
                </template>
                <template v-else>
                    <div class="">{{ data.placebetjson ? JSON.parse(data.placebetjson)['user_id'] : '-' }}</div>
                </template>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Vendor`)" style="min-width: 100px">
            <template #body="{ data }">
                <ProviderID id="bti" />
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
                <div class="flex align-items-center gap-2">
                    <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'sport')" />
                    <Button v-if="data.resultDetails && data.myurl " icon="mdi mdi-send" severity="success" @click="handleSendResult(data, 'sport')" />
                    <Button v-if="data.responseStatus == '1'" icon="mdi mdi-close" severity="danger" />
                </div>
            </template>
        </Column>
        <Column field="ratio" :header="this.$store.getters['languageStore/translate'](`BTI Result`)">
            <template #body="{ data }">
                <span v-if="data.resultDetails">{{ data.ratio }}</span>
                <span v-else>-</span>
                <!-- <span>{{ data.ratio }}</span> -->
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>

    <DataTable v-else :value="list" scrollable class="mt-4" stripedRows :loading="loading" size="small" :rowStyle="rowStyle">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <div>{{ data.partner_username }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 200px">
            <template #body="{ data }">
                <div>{{ data.user_username }}</div>
                <div>{{ data.user_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Vendor`)" style="min-width: 100px">
            <template #body="{ data }">
                <ProviderID :id="data.provider_id" />
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
                <!-- <span v-if="data.provider_id === 'gameplay'">{{ data.betdetails ? JSON.parse(data.betdetails)[0].bh_game_type : data.table_id }}</span> -->
                <span>{{ data.table_id }}</span>
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
                <template v-if="data.amount === 0">
                    <Tag v-if="data.winLose < 0" severity="danger" :value="`${$store.getters['languageStore/translate'](`FREE`)} - ${$store.getters['languageStore/translate'](`Lost`)}`"></Tag>
                    <Tag v-else-if="data.winLose > 0" severity="success" :value="`${$store.getters['languageStore/translate'](`FREE`)} - ${$store.getters['languageStore/translate'](`Won`)}`"></Tag>
                    <Tag v-else severity="warning" :value="`${$store.getters['languageStore/translate'](`FREE`)} - ${$store.getters['languageStore/translate'](`Tie`)}`"></Tag>
                </template>
                <template v-else>
                    <Tag v-if="data.betStatus === 'cancel'" severity="warning" :value="$store.getters['languageStore/translate'](`Canceled`)"></Tag>
                    <Tag v-else-if="data.winLose < 0" severity="danger" :value="$store.getters['languageStore/translate'](`Lost`)"></Tag>
                    <Tag v-else-if="data.winLose > 0" severity="success" :value="$store.getters['languageStore/translate'](`Won`)"></Tag>
                    <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Tie`)"></Tag>
                </template>
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
                <div class="flex align-items-center gap-2">
                    <template v-if="data.betdetails">
                        <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'casino')" />
                    </template>
                    <Button v-if="data.resultDetails " icon="mdi mdi-send" severity="success" @click="handleSendResult(data, 'casino')" />
                    <Button v-if="data.responseStatus == '1'" icon="mdi mdi-close" severity="danger" />
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
                items_count     : 20,
            },
            startDate   : new Date(),
            endDate     : new Date()
        }
    },
    watch: {
        'params.filter_username'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
        },
        'params.filter_trans_id'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
        },
        'params.filter_agentid'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
            this.getList()
        },
        'params.filter_islive'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
            this.getList()
        },
        'params.filter_status'(){
            this.params.page    = 1
            this.startDate      = new Date()
            this.endDate        = new Date()
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
            this.startDate      = new Date()
            this.endDate        = new Date()
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
        rowStyle(data) {
            if (data.bettype === 'slot' && data.amount === 0) {
                return { background: 'color-mix(in srgb, var(--yellow-500), transparent 92%)' };
            }
        },
        async handleSendResult(data, type) {
            if(type === 'sport') {

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
            } else {
                const {provider_id, resultDetails} = data
                const reqBody = {
                    Authorization       : `Bearer ${TOKEN}`,
                    username            : this.$store.state.userStore.username,
                    token               : this.$store.state.userStore.token,
                    filter_game_id      : provider_id,
                    filter_resultdetails: resultDetails
                }
                try {
                    const res = await api.resendResult(reqBody)
                    const code  = res.data.status;
                    const msg   = res.data.message;
                    console.log(res.data);

                    if(code == 0) {
                        let _msg = `${res.data.transaction_id} ${res.data.error_code ? res.data.error_code : ''} Balance: ${res.data.balance}`
                        this.$GF.customToast(1, _msg)
                        this.getList()
                    } else {
                        this.$GF.customToast(0, this.$store.getters['languageStore/translate'](`${msg ? msg : res.data.error_code}`))
                    }
                    
                } catch (e) {
                    console.error(e)
                    this.$GF.customToast(0, this.$store.getters['languageStore/translate'](`${e}`))
                }
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
        async showBetDetails(data, type) {
            if(type === 'sport') {
                const _data     = data;
                const details   = data.betDetails ? JSON.parse(data.betDetails) : null;
                const _details   = data.betdetails ? JSON.parse(data.betdetails) : null;
                const resultDetails = data.details ? JSON.parse(data.resultDetails) : null;
                const otherDetails = data.details ? JSON.parse(data.details) : null;

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
                        resultDetails: resultDetails,
                        otherDetails: otherDetails,
                        loading     : true,
                    },
                    onClose: (options) => {
                        // this.getList();
                    }
                });
            } else {

                try {
                    const reqBody = {
                        Authorization   : `Bearer ${TOKEN}`,
                        username        : this.$store.state.userStore.username,
                        token           : this.$store.state.userStore.token,
                        filter_game_id  : data.provider_id,
                        filter_details  : data.details,
                        filter_betdetails: data.betdetails,
                    }
                    const res = await api.getBetDetails(reqBody)
                    const code  = res.data.code;
                    const msg   = res.data.message;
                    console.log(res.data.data[0]);
    
                    if(code == 1) {
                        
                        const _data     = data;
                        const details   = data.betDetails ? JSON.parse(data.betDetails) : null;
                        const _details   = res.data.data[0].betdetails ? JSON.parse(res.data.data[0].betdetails) : null;
                        const resultDetails = res.data.data[0].resultDetails ? JSON.parse(res.data.data[0].resultDetails) : null;
                        const otherDetails = res.data.data[0].details ? JSON.parse(res.data.data[0].details) : null;
    
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
                                resultDetails: resultDetails,
                                otherDetails: otherDetails,
                                loading     : true,
                            },
                            onClose: (options) => {
                                // this.getList();
                            }
                        });
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                        
                } catch (e) {
                    console.error(e)
                    // this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            }
            
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