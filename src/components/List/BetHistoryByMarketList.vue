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
    <DataTable v-model:expandedRows="expandedRows" dataKey="betDetails" :value="list" scrollable class="mt-4"  stripedRows :loading="loading" >
        <Column :header="this.$store.getters['languageStore/translate'](`Sport`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.sportsName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(`${data.matchDateTime}Z`) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`League`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.leagueName }}</span>
            </template>
        </Column>
        <Column expander style="width: 3rem" />
        <Column :header="this.$store.getters['languageStore/translate'](`Market`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.eventName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Home`)" style="min-width: 400px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}}">
            <template #body="{ data }">
                <div>{{ data.homeName }}</div>
                <Divider />
                <div v-if="data.homeBettingName" :class="betAmountClass" @click="showMarketBetDetails(data, data.homeBettingName)">
                    <div :class="betAmountClass2">
                        <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.homeBettingAmount)">{{ this.$GF.formatNumComma(data.homeBettingAmount) }}</span>
                        <span> | </span>
                        <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.homeBettingExpAmount)">{{ this.$GF.formatNumComma(data.homeBettingExpAmount) }}</span>
                    </div>
                </div>
                <div class="" v-else>-</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`VS`)" style="min-width: 100px; max-width: 300px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}}" >
            <template #body="{ data }">
                <div v-if="data.drawBettingName" :class="betAmountClass" class="flex-wrap" @click="showMarketBetDetails(data, data.drawBettingName)" style="min-width: 300px;">
                    <div class="">
                        <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.drawBettingAmount)">{{ this.$GF.formatNumComma(data.drawBettingAmount) }}</span>
                        <span> | </span>
                        <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.drawBettingExpAmount)">{{ this.$GF.formatNumComma(data.drawBettingExpAmount) }}</span>
                    </div>
                </div>
                <span v-else>vs</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Away`)" style="min-width: 400px; text-align: center;" :pt="{headerContent: {style: {display: 'block'}}}">
            <template #body="{ data }">
                <div>{{ data.awayName }}</div>
                <Divider />
                <div v-if="data.awayBettingName" :class="betAmountClass" @click="showMarketBetDetails(data, data.awayBettingName)">
                    <div :class="betAmountClass2">
                        <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.awayBettingAmount)">{{ this.$GF.formatNumComma(data.awayBettingAmount) }}</span>
                        <span> | </span>
                        <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                        <span class="font-semibold" :class="this.$GF.handleTextColor(data.awayBettingExpAmount)">{{ this.$GF.formatNumComma(data.awayBettingExpAmount) }}</span>
                    </div>
                </div>
                <div class="" v-else>-</div>
            </template>
        </Column>
        <template #expansion="slotProps">
            <div class="p-3 surface-50 border-1 border-round border-200">
                <h5>{{ $store.getters['languageStore/translate']('Bet Details') }}</h5>
                <DataTable :value="JSON.parse(slotProps.data.betDetails)" >
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
                            <div class="font-semibold" :class="`${this.$GF.handleTextColor(data.betAmount)} ${betAmountExpansionClass}`" @click="showMarketBetDetails(slotProps.data, data.bettingName)">{{ this.$GF.formatNumComma(data.betAmount) }}</div>
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
        <div class="my-3">{{ $store.getters['languageStore/translate']('Sort by') }}:</div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByAmount" value="betSum" />
            <label for="sortByAmount" class="ml-2">{{ $store.getters['languageStore/translate']('Bet Amount') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByDate" value="matchDateTime" />
            <label for="sortByDate" class="ml-2">{{ $store.getters['languageStore/translate']('dateLang') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortBySport" value="sportsName" />
            <label for="sortBySport" class="ml-2">{{ $store.getters['languageStore/translate']('Sport') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByMarket" value="eventName" />
            <label for="sortByMarket" class="ml-2">{{ $store.getters['languageStore/translate']('Market') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByLeague" value="leagueName" />
            <label for="sortByLeague" class="ml-2">{{ $store.getters['languageStore/translate']('League') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByHome" value="homeName" />
            <label for="sortByHome" class="ml-2">{{ $store.getters['languageStore/translate']('Home') }}</label>
        </div>
        <div class="flex align-items-center mb-2">
            <RadioButton v-model="params.filter_sortby" inputId="sortByAway" value="awayName" />
            <label for="sortByAway" class="ml-2">{{ $store.getters['languageStore/translate']('Away') }}</label>
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
            expandedRows: {},
            currDate    : new Date(),
            providerValue: {},
            betType: null,
            rowCount: 20,
            totalCount: null,
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
                // filter_sort     : 'desc',
                page            : 1,
                items_count     : 20,
            },
            startDate   : new Date(defaultStartDate),
            endDate     : new Date(defaultEndDate),
            betAmountClass: 'cursor-pointer hover:surface-hover border-bottom-1 border-transparent hover:border-600 p-1 border-round border-noround-bottom transition-colors transition-duration-200 flex justify-content-center align-items-center gap-2',
            betAmountExpansionClass: 'cursor-pointer hover:surface-hover p-1 border-round transition-colors transition-duration-200 flex',
            betAmountClass2: 'flex flex-wrap justify-content-center align-items-center gap-2'
        }
    },
    watch: {
        'params.filter_sort'(){
            this.params.page    = 1
            // this.startDate      = new Date(defaultStartDate)
            // this.endDate        = new Date(defaultEndDate)
            this.getList()
        },
        'params.filter_sortby'(){
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
        async showMarketBetDetails(data, bettingName) {
            const {sportsName, leagueName, matchDateTime, eventName, matchName, isSplit, originalEventName} = data

            this.$dialog.open(this.$modalComponent.MarketBetDetails, {
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
                    agentID: this.params.filter_agentid,
                    sportsName: sportsName,
                    leagueName: leagueName,
                    matchDateTime: matchDateTime,
                    eventName: isSplit ? originalEventName : eventName,
                    matchName: matchName,
                    bettingName: bettingName,
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

                const res   = await api.recordHistoryListNew(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    // this.list = res.data.data;
                    
                    console.log('ORIGNAL DATA', res.data.data)

                    // EVENT NAME SPLITTER
                    const resData = res.data.data
                    let newList = []
                    for (var [index, item] of resData.entries()) {
                        const {eventName} = item

                        if (eventName.includes('|')) {
                            const eventNamesArr = eventName.split('|')
                            const trimEventName = eventNamesArr.map(word => word.trim())

                            trimEventName.map(eventItem => {
                                newList.push({
                                    ...item,
                                    eventName: eventItem,
                                    originalEventName: eventName,
                                    isSplit: true,
                                })
                            })
                        } else {
                            newList.push(item)
                        }
                    }
                    console.log('NEW UPDATED LIST', newList)
                    this.list = newList

                    const list = this.list
                    // const list = res.data.data

                    // BET DETAILS MANIPULATOR
                    for (var [index, item] of list.entries()) {
                        const { eventName, homeName, awayName } = item
                        const betDetails = JSON.parse(item.betDetails)
                        
                        // console.log('Item:', index, item)
                        // console.log('betDetails:', betDetails)

                        betDetails.map((item) => {
                            if (item.bettingName.includes(homeName)) {
                                this.list[index].homeBettingName = item.bettingName
                                this.list[index].homeBettingAmount = item.betAmount
                                this.list[index].homeBettingExpAmount = item.expectedWinAmount
                            }
                            if (item.bettingName.includes(awayName)) {
                                this.list[index].awayBettingName = item.bettingName
                                this.list[index].awayBettingAmount = item.betAmount
                                this.list[index].awayBettingExpAmount = item.expectedWinAmount
                            }
                            if (item.bettingName.includes('무승부') || item.bettingName.includes('예') || item.bettingName.includes('골')) {
                                this.list[index].drawBettingName = item.bettingName
                                this.list[index].drawBettingAmount = item.betAmount
                                this.list[index].drawBettingExpAmount = item.expectedWinAmount
                                if(item.bettingName.includes('골')) {
                                    this.list[index].notDraw = true
                                }
                            }
                        })

                        if (eventName == '오버언더' || eventName == '아시안 오버언더' || eventName == '1-3이닝 오버언더' || eventName == '1-5이닝 오버언더' || betDetails[0].bettingName.startsWith('오버') || betDetails[0].bettingName.startsWith('언더')) {
                            let arr = []

                            if (betDetails.length > 1) {

                                const groupedBets = betDetails.reduce((acc, bet) => {
                                    const number = parseFloat(bet.bettingName.match(/[\d\.]+/)[0]);
                                    if (!acc[number]) {
                                        acc[number] = { over: [], under: [] };
                                    }
                                    if (bet.bettingName.startsWith("오버")) {
                                        acc[number].over.push(bet);
                                    } else if (bet.bettingName.startsWith("언더")) {
                                        acc[number].under.push(bet);
                                    }
                                    return acc;
                                }, {});
    
                                // console.log('Grouped OverUnder', groupedBets)
    
                                Object.keys(groupedBets).map(number => {
                                    if(groupedBets[number].over.length > 0 && groupedBets[number].under.length > 0) {
                                        arr.push({
                                            over: groupedBets[number].over[0],
                                            under: groupedBets[number].under[0],
                                        })
                                    } else {
                                        if (groupedBets[number].over.length > 0) {
                                            this.list[index].homeBettingName = groupedBets[number].over[0].bettingName
                                            this.list[index].homeBettingAmount = groupedBets[number].over[0].betAmount
                                            this.list[index].homeBettingExpAmount = groupedBets[number].over[0].expectedWinAmount
                                        }
                                        if (groupedBets[number].under.length > 0) {
                                            this.list[index].awayBettingName = groupedBets[number].under[0].bettingName
                                            this.list[index].awayBettingAmount = groupedBets[number].under[0].betAmount
                                            this.list[index].awayBettingExpAmount = groupedBets[number].under[0].expectedWinAmount
                                        }
                                    }
                                })
    
                                // console.log('Paired OverUnder', arr)
                                if (arr.length > 0) {
                                    this.list[index].homeBettingName = arr[0].over.bettingName
                                    this.list[index].homeBettingAmount = arr[0].over.betAmount
                                    this.list[index].homeBettingExpAmount = arr[0].over.expectedWinAmount
    
                                    this.list[index].awayBettingName = arr[0].under.bettingName
                                    this.list[index].awayBettingAmount = arr[0].under.betAmount
                                    this.list[index].awayBettingExpAmount = arr[0].under.expectedWinAmount
                                }
                            } else {
                                if (betDetails[0].bettingName.split(' ').includes('오버')) {
                                    this.list[index].homeBettingName = betDetails[0].bettingName
                                    this.list[index].homeBettingAmount = betDetails[0].betAmount
                                    this.list[index].homeBettingExpAmount = betDetails[0].expectedWinAmount
                                }
                                if (betDetails[0].bettingName.split(' ').includes('언더')) {
                                    this.list[index].awayBettingName = betDetails[0].bettingName
                                    this.list[index].awayBettingAmount = betDetails[0].betAmount
                                    this.list[index].awayBettingExpAmount = betDetails[0].expectedWinAmount
                                }
                            }
                        }
                    }

                    console.log('Final List', this.list)
                    // const addedRows = this.list.length - res.data.data.length
                    // this.totalCount = res.data.totalCount + addedRows
                    // this.rowCount = this.params.items_count + addedRows
                    // console.log(`Final List Length (${this.list.length}) - Original List Length (${res.data.data.length}) = ${addedRows}`)
                    // console.log('Total Count', this.totalCount)
                    // console.log('Row Count', this.rowCount)

                    this.totalCount = res.data.totalCount
                    // this.$store.dispatch('betSummStore/setBetSumm', res.data.betSumm)
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