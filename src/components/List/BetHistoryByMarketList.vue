<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Agent ID') }}</label>
            <PartnerSelect v-model="params.filter_agentid" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Live or Not') }}</label>
            <IsLiveSelect v-model="params.filter_islive" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('Bet Total') }}</label>
            <BetTotalSelect v-model="params.filter_amount" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" hourFormat="24" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon showTime showSeconds iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" class="w-full" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" hourFormat="24" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minDate="startDate" :maxDate="currDate" showIcon showTime showSeconds iconDisplay="input" inputId="icondisplay" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <div class="flex justify-content-between gap-3">
                <Button class="w-full" icon="mdi mdi-magnify" @click="getList()" />
                <Button class="w-full text-2xl p-0" icon="mdi mdi-filter-variant" @click="(event) => this.$refs.sortPanel.toggle(event)" text :pt="{icon: {style: {display: 'flex'}}}" />
            </div>

        </div>
    </div>
    <DataTable v-model:expandedRows="expandedRows" dataKey="betDetails" :value="list" scrollable class="mt-4" :loading="loading" size="small" >
        <Column :header="this.$store.getters['languageStore/translate'](`Sport`)" :pt="{bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <span>{{ data.sportsName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" :pt="{bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="white-space-nowrap">{{ this.$GF.getDateTime(`${data.matchDateTime}Z`) }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`League`)" :pt="{bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="white-space-nowrap">{{ data.leagueName }}</div>
            </template>
        </Column>
        <Column expander style="width: 2rem" :pt="{bodyCell: {class: 'border-300'}}" />
        <Column :header="this.$store.getters['languageStore/translate'](`Market`)" style="max-width: 220px;" :pt="{bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="">{{ data.eventName }}</div>
                <Button icon="mdi mdi-eye" :label="$store.getters['languageStore/translate'](`Detailed Market`)" @click="showMarketBetDetails(data)" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Total`)" :pt="{bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="font-bold">{{ this.$GF.formatNumComma(data.betSum) }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Home`)" style="min-width: 100px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}, bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="font-bold">{{ data.homeName }}</div>
                <Divider class="my-2" />
                <div v-if="data.homeBettingAmount" :class="betAmountClass" style="height: 48px;">
                    <div :class="betAmountClass2">
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.homeBettingAmount)">{{ this.$GF.formatNumComma(data.homeBettingAmount) }}</span>
                        </div>
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.homeBettingExpAmount)">{{ this.$GF.formatNumComma(data.homeBettingExpAmount) }}</span>
                        </div>
                    </div>
                </div>
                <div class="" v-else style="height: 48px;">-</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`VS`)" style="min-width: 100px; max-width: 200px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}, bodyCell: {class: 'border-300'}}" >
            <template #body="{ data }">
                <div v-if="data.drawBettingAmount">
                    <div class="">
                        <div class="font-bold">vs</div>
                        <Divider class="my-2" />
                    </div>
                    <div :class="betAmountClass" @click="showMarketBetDetails(data, data.drawBettingName)" style="height: 48px;">
                        <div :class="betAmountClass2">
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.drawBettingAmount)">{{ this.$GF.formatNumComma(data.drawBettingAmount) }}</span>
                            </div>
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.drawBettingExpAmount)">{{ this.$GF.formatNumComma(data.drawBettingExpAmount) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <span class="font-bold">vs</span>
                    <Divider class="my-2" />
                    <div class="flex justify-content-center align-items-center" style="height: 48px;">&nbsp;</div>
                </div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Away`)" style="min-width: 100px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}, bodyCell: {class: 'border-300'}}">
            <template #body="{ data }">
                <div class="font-bold">{{ data.awayName }}</div>
                <Divider class="my-2" />
                <div v-if="data.awayBettingAmount" :class="betAmountClass" style="height: 48px;">
                    <div :class="betAmountClass2">
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.awayBettingAmount)">{{ this.$GF.formatNumComma(data.awayBettingAmount) }}</span>
                        </div>
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.awayBettingExpAmount)">{{ this.$GF.formatNumComma(data.awayBettingExpAmount) }}</span>
                        </div>
                    </div>
                </div>
                <div class="" v-else style="height: 48px;">-</div>
            </template>
        </Column>
        <template #expansion="slotProps">
            <div class="p-3 surface-50 border-1 border-round border-200">
                <h5>{{ $store.getters['languageStore/translate']('Bet Details') }}</h5>
                <DataTable :value="JSON.parse(slotProps.data.betDetails)" >
                    <Column :header="this.$store.getters['languageStore/translate'](`Market`)">
                        <template #body="{data}">
                            {{ data.eventName }}
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Betting Name`)">
                        <template #body="{data}">
                            {{ data.bettingName }}
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Odds`)">
                        <template #body="{data}">
                            {{ data.odds }}
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`betAmountLang`)">
                        <template #body="{data}">
                            <div class="font-semibold">{{ this.$GF.formatNumComma(data.betAmount) }}</div>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`expectedAmountLang`)">
                        <template #body="{data}">
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.expectedWinAmount)">{{ this.$GF.formatNumComma(data.expectedWinAmount) }}</span>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`winningAmountLang`)">
                        <template #body="{data}">
                            <span class="font-semibold" :class="this.$GF.handleTextColor(data.winAmount)">{{ this.$GF.formatNumComma(data.winAmount) }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
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
    <OverlayPanel ref="sortPanel">
        <Button :label="params.filter_sort === 'desc' ? $store.getters['languageStore/translate']('Descending') : $store.getters['languageStore/translate']('Ascending')" :icon="`mdi ${params.filter_sort === 'desc' ?  'mdi-sort-descending' : 'mdi-sort-ascending'} `" @click="toggleSort" text />
        <div class="my-3">{{ $store.getters['languageStore/translate']('Sort by') }}:</div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByAmount" value="betSum" />
            <label for="sortByAmount" class="ml-2">{{ $store.getters['languageStore/translate']('Bet Amount') }}</label>
        </div>
        
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByHome" value="matchName" />
            <label for="sortByHome" class="ml-2">{{ $store.getters['languageStore/translate']('Game Name') }}</label>
        </div>
    </OverlayPanel>
</template>

<script>
import { api, TOKEN } from '@/axios/api';

const defaultStartDate = new Date().setHours(0o0, 0o0, 0o0)
const defaultEndDate = new Date().setHours(23, 59, 59)

export default {
    data() {
        return {
            overlayData: null,
            expandedRows: {},
            currDate    : new Date(),
            providerValue: {},
            betType: null,
            rowCount: 20,
            totalCount: null,
            filterEndDate: null,
            rowData : {},
            loading : false,
            list    : [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                // filter_trans_id : '',
                filter_game_id  : 'bti',
                filter_startdate: null,
                filter_enddate  : null,
                filter_islive   : '',
                // filter_status   : null,
                filter_amount   : null,
                filter_sortby   : 'betSum',
                filter_sort     : 'desc',
                page            : 1,
                items_count     : 20,
            },
            startDate   : new Date(defaultStartDate),
            endDate     : new Date(defaultEndDate),
            betAmountClass: 'border-bottom-1 border-transparent p-1 border-round border-noround-bottom flex justify-content-center align-items-center gap-2',
            betAmountExpansionClass: 'cursor-pointer hover:surface-hover p-1 border-round transition-colors transition-duration-200 flex',
            betAmountClass2: 'flex flex-wrap flex-column justify-content-center align-items-center gap-2 text-sm',
            betAmountClass3: 'flex justify-content-center align-items-center gap-2'
        }
    },
    watch: {
        'params.filter_sortby'(newVal){
            console.log('Sort:', newVal)
            if (newVal === 'matchName') this.params.filter_sort = 'asc'
            else this.params.filter_sort = 'desc'
            this.params.page    = 1
            // this.startDate      = new Date(defaultStartDate)
            // this.endDate        = new Date(defaultEndDate)
            this.getList()
        },
        'params.filter_agentid'(){
            this.params.page    = 1
            this.startDate      = new Date(defaultStartDate)
            this.endDate        = new Date(defaultEndDate)
            this.getList()
        },
        'params.filter_islive'(){
            this.params.page    = 1
            this.startDate      = new Date(defaultStartDate)
            this.endDate        = new Date(defaultEndDate)
            this.getList()
        },
        '$route'(data) {
            console.log('ROUTE',data);
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        toggleSort() {
            if (this.params.filter_sort === 'desc') {
                this.params.filter_sort = 'asc'
            } else {
                this.params.filter_sort = 'desc'
            }

            this.params.page    = 1
            // this.startDate      = new Date(defaultStartDate)
            // this.endDate        = new Date(defaultEndDate)
            this.getList()
        },
        showBetsOverlay(event, data, side) {
            console.log('hh data', data)
            this.overlayData = data

            if (data.isHandicapParing) {
                if (side === 'home') {
                    this.$refs.hHandicapPanel.toggle(event)
                } else {
                    this.$refs.aHandicapPanel.toggle(event)
                }
            }

            if (data.isOUParing) {
                if (side === 'home') {
                    this.$refs.overPanel.toggle(event)
                } else {
                    this.$refs.underPanel.toggle(event)
                }
            }
        },
        reverseAwaySign(str) {
            if (str) {
                if (str == '+') {
                    return '-'
                } else {
                    return '+'
                }
            } else {
                return ''
            }
        },
        async showMarketBetDetails(data, bettingName) {
            const {sportsName, leagueName, matchDateTime, matchName } = data

            console.log(data)

            this.$dialog.open(this.$modalComponent.EventBetDetails, {
                props: {
                    header: `${this.$store.getters['languageStore/translate'](`detailLang`)} - ${matchName}`,
                    style: {
                        width: '80vw'
                    },
                    modal: true,
                    maximizable: true,
                    dismissableMask: true,
                },
                data: {
                    sportsName: sportsName,
                    leagueName: leagueName,
                    matchDateTime: matchDateTime,
                    matchName: matchName,
                },
                onClose: (options) => {
                    // this.getList();
                }
            });
        },
        // handleFilterTrans() {
        //     this.params.page    = 1
        //     this.startDate      = null
        //     this.endDate        = null
        //     this.getList()
        // },
        handleDateChange() {
            this.params.page = 1
            // this.getPartnerCash()
        },
        handlePagination(data) {
            console.log('page data', data)
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                // this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username
                // this.params.filter_bettype = this.$route.query.bettype === 'sport' ? undefined : this.$route.query.bettype
                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime2(this.startDate)}` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime2(this.endDate)}` : null;

                const res   = await api.recordHistoryListMain(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

                if(code === 1) {
                    
                    console.log('ORIGNAL DATA', res.data.data)

                    this.list = res.data.data

                    const list = this.list

                    // BET DETAILS MANIPULATOR
                    for (var [index, item] of list.entries()) {
                        const { homeName, awayName } = item
                        const betDetails = JSON.parse(item.betDetails)

                        let homeBTotal = 0
                        let homeETotal = 0
                        let awayBTotal = 0
                        let awayETotal = 0
                        let drawBTotal = 0
                        let drawETotal = 0
                        if(betDetails) {
                            betDetails.map((item) => {
                                if (item.bettingName.includes(homeName) || item.bettingName.includes('오버')) {
                                    homeBTotal += item.betAmount
                                    homeETotal += item.expectedWinAmount
                                } else if (item.bettingName.includes(awayName) || item.bettingName.includes('언더')) {
                                    awayBTotal += item.betAmount
                                    awayETotal += item.expectedWinAmount
                                } else if (item.bettingName.includes('무승부') || item.bettingName.includes('예') || item.bettingName.includes('골')) {
                                    drawBTotal += item.betAmount
                                    drawETotal += item.expectedWinAmount
                                } else {
                                    drawBTotal += item.betAmount
                                    drawETotal += item.expectedWinAmount
                                }
                            })
                        }
                        this.list[index].homeBettingAmount      = homeBTotal
                        this.list[index].homeBettingExpAmount   = homeETotal
                        this.list[index].awayBettingAmount      = awayBTotal
                        this.list[index].awayBettingExpAmount   = awayETotal
                        this.list[index].drawBettingAmount      = drawBTotal
                        this.list[index].drawBettingExpAmount   = drawETotal
                    }

                    console.log('Final List', this.list)
                    this.totalCount = res.data.totalCount
                    this.filterEndDate = res.data.filter_enddate
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