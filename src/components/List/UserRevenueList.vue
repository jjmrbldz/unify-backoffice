<template>
    <div class="grid">
        <div class="col-2">
            <span>{{ $store.getters['languageStore/translate'](`Agent Name`) }}</span><br>
            <span>{{ userData.partner_username }}</span>
        </div>
        <div class="col-2">
            <span>{{ $store.getters['languageStore/translate'](`Today Betting Amount`) }}</span><br>
            <span>{{ this.$GF.formatNumComma(userData.todayBetting) }}</span>
        </div>
    </div>
    <Divider />
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('typeLang') }}</label>
            <GameTypeSelect v-model="gameType" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('providerLang') }}</label>
            <ProviderTypeSelect v-model="providerType" :game-type="gameType"  />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('startDateLang') }}</label>
            <Calendar v-model="startDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :maxDate="currDate" showIcon iconDisplay="input" inputClass="w-full" class="w-full" />
        </div>
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('endDateLang') }}</label>
            <Calendar v-model="endDate" placeholder="yyyy-mm-dd" dateFormat="yy-mm-dd" @dateSelect="handleDateChange()" @keyup.enter="handleDateChange()" :minData="startDate" :maxDate="currDate" showIcon iconDisplay="input" inputClass="w-full" class="w-full" />
        </div>
        <div class="field col-1">
            <label>&nbsp;</label>
            <Button class="w-full" label="Search" @click="getList()" />
        </div>
    </div>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <!-- <Column :header="this.$store.getters['languageStore/translate'](`Agent`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{data.partner_username }}</span>
            </template>
        </Column> -->
        <!-- <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{data.tp_nickname }}</span>
            </template>
        </Column> -->
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Amount Sum`)" class="text-left" style="min-width: 100px">
            <!-- <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.totalBetAmount)">{{ this.$GF.formatNumComma(data.totalBetAmount) }}</span>
            </template> -->
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Result Amount Sum`)" class="text-left" style="min-width: 100px">
            <!-- <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.totalWinAmount)">{{ this.$GF.formatNumComma(data.totalWinAmount) }}</span>
            </template> -->
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Tie Betting`)" class="text-left" style="min-width: 100px">
            <!-- <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.totalTieAmount)">{{ this.$GF.formatNumComma(data.totalTieAmount) }}</span>
            </template> -->
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Win Loss`)" class="text-left" style="min-width: 100px">
            <!-- <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.winLose)">{{ this.$GF.formatNumComma(data.winLose) }}</span>
            </template> -->
        </Column>
        <!-- <Column :header="this.$store.getters['languageStore/translate'](`Bettor Count`)" class="text-left" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.userCount) }}</span>
            </template>
        </Column> -->
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Return Rate`)" class="text-left" style="min-width: 100px">
            <!-- <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.bettingRate)">{{ this.$GF.formatTwoDecimal(data.bettingRate) }}%</span>
            </template> -->
        </Column>
        <ColumnGroup type="footer">
            <Row>
                <!-- <Column :footer="$store.getters['languageStore/translate'](`SUM`)" :colspan="showAll ? 2 : 2" footerStyle="text-align:left"/> -->
                <Column :footer="this.$GF.formatNumComma(totalBetAmount)" :footerClass="`${this.$GF.handleTextColor(totalBetAmount)} text-left`" />
                <Column :footer="this.$GF.formatNumComma(totalWinAmount)" :footerClass="`${this.$GF.handleTextColor(totalWinAmount)} text-left`" />
                <Column :footer="this.$GF.formatNumComma(totalTieAmount)" :footerClass="`${this.$GF.handleTextColor(totalTieAmount)} text-left`" />
                <Column :footer="this.$GF.formatNumComma(totalwinLose)" :footerClass="`${this.$GF.handleTextColor(totalwinLose)} text-left`" />
                <!-- <Column :footer="this.$GF.formatNumComma(totalBettorCount)" /> -->
                <Column :footer="`${this.$GF.formatTwoDecimal(totalbettingRate)}%`" :footerClass="`${this.$GF.handleTextColor(totalbettingRate)} text-left`" />
            </Row>
        </ColumnGroup>
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
import GameTypeSelect from '../GlobalComponents/GameTypeSelect.vue';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            userData    : this.dialogRef.data ? this.dialogRef.data.userData : null,
            showAll     : false,
            currDate    : new Date(),
            totalCount  : null,
            rowData     : {},
            loading     : false,
            list        : [],
            gameType    : null,
            providerType    : null,
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_userid   : null,
                filter_type     : '',
                filter_provider : '',
                filter_startdate: null,
                filter_enddate  : null,
                page            : 1,
                items_count     : 10,
            },
            startDate   : new Date(),
            endDate     : new Date()
        }
    },
    computed: {
        totalBetAmount() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.totalBetAmount);
            }

            return total;
        },
        totalWinAmount() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.totalWinAmount);
            }

            return total;
        },
        totalTieAmount() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.totalTieAmount);
            }

            return total;
        },
        totalBettorCount() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.userCount);
            }

            return total;
        },
        totalbettingRate() {
            let total = 0;
            // for(let item of this.list) {
            //     total += item.bettingRate;
            // }
            total = ((this.totalBetAmount - this.totalWinAmount) / this.totalBetAmount) * 100
            return total;
        },
        totalwinLose() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.winLose);
            }
            console.log(this.$GF.handleTextColor(total))
            return total;
        },
    },
    watch: {
        gameType(newVal, oldVal){
            this.params.filter_type = newVal
        },
        providerType(newVal, oldVal){
            this.params.filter_provider = newVal
        },
    },
    mounted() {
        this.getList()
    },
    methods: {
        showAllGames() {
            this.showAll = !this.showAll
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
                this.params.filter_agentid = this.userData.partner_username
                // this.params.filter_username = this.userData.tu_real_username
                this.params.filter_userid = parseInt(this.userData.id)
                this.params.filter_startdate = this.startDate ? `${this.$GF.getDateTime(this.startDate, 'date')} 00:00:00` : null;
                this.params.filter_enddate = this.endDate ? `${this.$GF.getDateTime(this.endDate, 'date')} 23:59:59` : null;
                
                const res   = await api.getUserRevenueList(this.params);
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