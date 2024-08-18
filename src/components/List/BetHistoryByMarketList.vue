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
                <div v-if="data.isHandicapParing" class="">
                    <div :class="betAmountClass" @click="(event) => showBetsOverlay(event, data, 'home')" style="height: 48px; background: color-mix(in srgb, var(--blue-500), transparent 80%)">
                        <div :class="betAmountClass2">
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.hHandicapBetSum)">{{ this.$GF.formatNumComma(data.hHandicapBetSum) }}</span>
                            </div>
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.hHandicapExpSum)">{{ this.$GF.formatNumComma(data.hHandicapExpSum) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="data.isOUParing" class="">
                    <div :class="betAmountClass" @click="(event) => showBetsOverlay(event, data, 'home')" style="height: 48px; background: color-mix(in srgb, var(--primary-500), transparent 80%)">
                        <div :class="betAmountClass2">
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.overBetsum)">{{ this.$GF.formatNumComma(data.overBetsum) }}</span>
                            </div>
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.overExpsum)">{{ this.$GF.formatNumComma(data.overExpsum) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="data.homeBettingName" :class="betAmountClass" @click="showMarketBetDetails(data, data.homeBettingName)" style="height: 48px;">
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
                <div v-if="data.isHandicapParing" class="">
                    <div class="font-bold">vs</div>
                    <Divider class="my-2" />
                    <div class="flex justify-content-center align-items-center" style="height: 48px;">&nbsp;</div>
                </div>
                <div v-else-if="data.isOUParing" class="">
                    <div class="font-bold">vs</div>
                    <Divider class="my-2" />
                    <div class="flex justify-content-center align-items-center" style="height: 48px;">&nbsp;</div>
                </div>
                <div v-else-if="data.drawBettingName">
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
                <div v-if="data.isHandicapParing" class="">
                    <div :class="betAmountClass" @click="(event) => showBetsOverlay(event, data, 'away')" style="height: 48px; background: color-mix(in srgb, var(--cyan-500), transparent 80%)">
                        <div :class="betAmountClass2">
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.aHandicapBetSum)">{{ this.$GF.formatNumComma(data.aHandicapBetSum) }}</span>
                            </div>
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.aHandicapExpSum)">{{ this.$GF.formatNumComma(data.aHandicapExpSum) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="data.isOUParing" class="">
                    <div :class="betAmountClass" @click="(event) => showBetsOverlay(event, data, 'away')" style="height: 48px; background: color-mix(in srgb, var(--green-500), transparent 80%)">
                        <div :class="betAmountClass2">
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.underBetsum)">{{ this.$GF.formatNumComma(data.underBetsum) }}</span>
                            </div>
                            <div class="">
                                <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                                <span class="font-semibold" :class="this.$GF.handleTextColor(data.underExpsum)">{{ this.$GF.formatNumComma(data.underExpsum) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else-if="data.awayBettingName" :class="betAmountClass" @click="showMarketBetDetails(data, data.awayBettingName)" style="height: 48px;">
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

    <OverlayPanel ref="hHandicapPanel" >
        <template v-for="(value, key, index) in overlayData.handicapPair">
            <template v-if="value.home.length > 0" v-for="item in value.home">
                <div :class="betAmountClass" @click="showMarketBetDetails(overlayData, item.bettingName)" style="height: 48px;">
                    <div :class="betAmountClass3">
                        <div class="font-bold">
                            <span>
                                <template v-if="value.home.length > 0">
                                    <span>{{ value.homeHandicapSign }}</span>
                                </template>
                                <template v-else>
                                    <span>{{ reverseAwaySign(value.awayHandicapSign) }}</span>
                                </template>
                                <span>{{ key }}</span>
                            </span>
                        </div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.betAmount)">{{ this.$GF.formatNumComma(item.betAmount) }}</span>
                        </div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.expectedWinAmount)">{{ this.$GF.formatNumComma(item.expectedWinAmount) }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex justify-content-center align-items-center" v-else style="height: 48px;">-</div>
        </template>
    </OverlayPanel>

    <OverlayPanel ref="aHandicapPanel" >
        <template v-for="(value, key, index) in overlayData.handicapPair">
            <template v-if="value.away.length > 0" v-for="item in value.away">
                <div :class="betAmountClass" @click="showMarketBetDetails(overlayData, item.bettingName)" style="height: 48px;">
                    <div :class="betAmountClass3">
                        <div class="font-bold">
                            <span>
                                <template v-if="value.home.length > 0">
                                    <span>{{ value.awayHandicapSign }}</span>
                                </template>
                                <template v-else>
                                    <span>{{ reverseAwaySign(value.awayHandicapSign) }}</span>
                                </template>
                                <span>{{ key }}</span>
                            </span>
                        </div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.betAmount)">{{ this.$GF.formatNumComma(item.betAmount) }}</span>
                        </div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.expectedWinAmount)">{{ this.$GF.formatNumComma(item.expectedWinAmount) }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex justify-content-center align-items-center" v-else style="height: 48px;">-</div>
        </template>
    </OverlayPanel>

    <OverlayPanel ref="overPanel" >
        <template v-for="(value, key, index) in overlayData.overUnderPair">
            <template v-if="value.over.length > 0" v-for="item in value.over">
                <div :class="betAmountClass" @click="showMarketBetDetails(overlayData, item.bettingName)" style="height: 48px;">
                    <div :class="betAmountClass3">
                        <div class="font-bold">{{ key }}</div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.betAmount)">{{ this.$GF.formatNumComma(item.betAmount) }}</span>
                        </div>
                        <Divider class="mx-1" layout="vertical" />
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.expectedWinAmount)">{{ this.$GF.formatNumComma(item.expectedWinAmount) }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex justify-content-center align-items-center" v-else style="height: 48px;">-</div>
        </template>
    </OverlayPanel>

    <OverlayPanel ref="underPanel" >
        <template v-for="(value, key, index) in overlayData.overUnderPair">
            <template v-if="value.under.length > 0" v-for="item in value.under">
                <div :class="betAmountClass" @click="showMarketBetDetails(overlayData, item.bettingName)" style="height: 48px;">
                    <div :class="betAmountClass3">
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.betAmount)">{{ this.$GF.formatNumComma(item.betAmount) }}</span>
                        </div>
                        <div class="">
                            <span>{{ $store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                            <span class="font-semibold" :class="this.$GF.handleTextColor(item.expectedWinAmount)">{{ this.$GF.formatNumComma(item.expectedWinAmount) }}</span>
                        </div>
                    </div>
                </div>
            </template>
            <div class="flex justify-content-center align-items-center" v-else style="height: 48px;">-</div>
        </template>
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
            betAmountClass: 'cursor-pointer hover:surface-200 border-bottom-1 border-transparent hover:border-600 p-1 border-round border-noround-bottom transition-colors transition-duration-200 flex justify-content-center align-items-center gap-2',
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
                        if(betDetails) {

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
    
                            // GROUPING HANDICAP
                            if (eventName == '핸디캡' || eventName == '아시안 핸디캡' || eventName.includes('핸디캡')) {
                                let hHandicapBetSum = 0
                                let hHandicapExpSum = 0
                                let aHandicapBetSum = 0
                                let aHandicapExpSum = 0
                                const groupedBets = betDetails.reduce((acc, bet) => {
                                    // const number = parseFloat(bet.bettingName.match(/-?\d+(\.\d+)?/)[0]);
                                    const number = parseFloat(bet.bettingName.match(/[\d\.]+/)[0]);
                                    if (!acc[number]) {
                                        acc[number] = { home: [], away: [], homeHandicapSign: '', awayHandicapSign: '' };
                                    }
                                    if (bet.bettingName.includes(item.homeName)) {
                                        acc[number].home.push(bet);

                                        const matchSign = bet.bettingName.match(/([+-])(\d+(\.\d+)?)/)
                                        if (matchSign) {
                                            acc[number].homeHandicapSign = matchSign[1]
                                        }

                                    } else if (bet.bettingName.includes(item.awayName)) {
                                        acc[number].away.push(bet);

                                        const matchSign = bet.bettingName.match(/([+-])(\d+(\.\d+)?)/)
                                        if (matchSign) {
                                            acc[number].awayHandicapSign = matchSign[1]
                                        }
                                    }

                                    return acc;
                                }, {});

                                // SUM AMOUNTS HANDICAP
                                Object.keys(groupedBets).map(number => {
                                    const {home, away} = groupedBets[number]
                                        for (const x of home) {
                                            console.log('home handicap betAmount: ', x.betAmount)
                                            hHandicapBetSum += x.betAmount
                                            hHandicapExpSum += x.expectedWinAmount
                                        }
                                        for (const x of away) {
                                            console.log('away handicap betAmount: ', x.betAmount)
                                            aHandicapBetSum += x.betAmount
                                            aHandicapExpSum += x.expectedWinAmount
                                        }
                                })
    
                                console.log('Grouped Handicap', groupedBets)
                                this.list[index].isHandicapParing = true
                                this.list[index].handicapPair = groupedBets

                                this.list[index].hHandicapBetSum = hHandicapBetSum
                                this.list[index].hHandicapExpSum = hHandicapExpSum
                                this.list[index].aHandicapBetSum = aHandicapBetSum
                                this.list[index].aHandicapExpSum = aHandicapExpSum
                            }
    
                            // GROUPING OVER UNDER
                            if (eventName == '오버언더' || eventName == '아시안 오버언더' || eventName == '1-3이닝 오버언더' || eventName == '1-5이닝 오버언더' || betDetails[0].bettingName.startsWith('오버') || betDetails[0].bettingName.startsWith('언더')) {
                                let arr = []
                                let overBetsum = 0
                                let overExpsum = 0
                                let underBetsum = 0
                                let underExpsum = 0
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
        
                                    console.log('Grouped OverUnder', groupedBets)
                                    this.list[index].isOUParing = true
                                    this.list[index].overUnderPair = groupedBets

                                    Object.keys(groupedBets).map(number => {
                                        // SUM AMOUNT OVERUNDER
                                        const {over, under} = groupedBets[number]
                                        for (const x of over) {
                                            // console.log('over betAmount: ', x.betAmount)
                                            overBetsum += x.betAmount
                                            overExpsum += x.expectedWinAmount
                                        }
                                        for (const x of under) {
                                            // console.log('under betAmount: ', x.betAmount)
                                            underBetsum += x.betAmount
                                            underExpsum += x.expectedWinAmount
                                        }
    
                                        if(groupedBets[number].over.length > 0 && groupedBets[number].under.length > 0) {
                                            arr.push({
                                                over: groupedBets[number].over[0],
                                                odds: number,
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

                                    this.list[index].overBetsum = overBetsum
                                    this.list[index].overExpsum = overExpsum
                                    this.list[index].underBetsum = underBetsum
                                    this.list[index].underExpsum = underExpsum

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
                    }

                    console.log('Final List', this.list)
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