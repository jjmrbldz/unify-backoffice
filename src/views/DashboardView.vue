<template>
    <h3>{{ $store.getters['languageStore/translate'](`Today`) }}</h3>
    <div class="dashSumm">
        <div class="dashSummList">
            <template v-if="isLoading">
                <Card v-for="key in 9">
                    <template #content>
                        <div class="dashSummItem">
                            <div class="summIcon">
                                <Skeleton width="100%" height="100%" />
                            </div>
                            <div class="summContent">
                                <Skeleton class="title" width="3rem" height="17px" />
                                <Skeleton class="summ" width="12rem" height="24px" />
                            </div>
                        </div>
                    </template>
                </Card>
            </template>
            <template v-else>
                <Card v-for="item in summaryItems">
                    <template #content>
                        <div class="dashSummItem">
                            <div class="summIcon">
                                <span :class="item.icon"></span>
                            </div>
                            <div class="summContent">
                                <div class="title">{{ $store.getters['languageStore/translate'](`${item.title}`) }}</div>
                                <div class="summ">{{ item.summ }}</div>
                            </div>
                        </div>
                    </template>
                </Card>
            </template>
        </div>
    </div>
    <Divider />
    <h3>{{ $store.getters['languageStore/translate'](`This month`) }}</h3>
    <div class="dashSumm">
        <div class="dashSummList">
            <template v-if="isLoading2">
                <Card v-for="key in 9">
                    <template #content>
                        <div class="dashSummItem">
                            <div class="summIcon">
                                <Skeleton width="100%" height="100%" />
                            </div>
                            <div class="summContent">
                                <Skeleton class="title" width="3rem" height="17px" />
                                <Skeleton class="summ" width="12rem" height="24px" />
                            </div>
                        </div>
                    </template>
                </Card>
            </template>
            <template v-else>
                <Card v-for="item in summaryItems2">
                    <template #content>
                        <div class="dashSummItem">
                            <div class="summIcon2">
                                <span :class="item.icon"></span>
                            </div>
                            <div class="summContent">
                                <div class="title">{{ $store.getters['languageStore/translate'](`${item.title}`) }}</div>
                                <div class="summ">{{ item.summ }}</div>
                            </div>
                        </div>
                    </template>
                </Card>
            </template>
        </div>
    </div>
</template>

<script>
import { TOKEN, api } from '@/axios/api';
import { mapGetters } from 'vuex';
 export default {
    data() {
        return {
            summaryItems: [],
            summaryItems2: [],
            currDate: new Date(),
            list: [],
            listLength: 0,
            isLoading2: true,
        }
    },
    computed: {
        ...mapGetters('userStore', ['isLoading']),
        firstDay() {
            let year = this.currDate.getFullYear()
            let month = this.currDate.getMonth()

            let fDay =  new Date(year, month, 1)

            return this.$GF.getDateTime(fDay, 'date')
        },
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
        winLose() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.winLose);
            }

            return total;
        },
        userCount() {
            let total = 0;
            for(let item of this.list) {
                total += parseInt(item.userCount);
            }

            return total;
        },
        casinoBetRatio() {
            let total = 0;
            for(let item of this.list) {
                total += item.casinoBetRatio ? parseFloat(item.casinoBetRatio) : 0.00;
                console.log('Casino Ratio:',  parseFloat(item.casinoBetRatio), '->', item.casinoBetRatio);
            }
            total = total / this.listLength

            return total;
        },
        minigameBetRatio() {
            let total = 0;
            for(let item of this.list) {
                total += item.minigameBetRatio ? parseFloat(item.minigameBetRatio) : 0.00;
                console.log('Minigame Bet Ratio:', item.minigameBetRatio)
            }
            total = total / this.listLength

            return total;
        },
        slotBetRatio() {
            let total = 0;
            for(let item of this.list) {
                total += item.slotBetRatio ? parseFloat(item.slotBetRatio) : 0.00;
            }
            total = total / this.listLength

            return total;
        },
        sportBetRatio() {
            let total = 0;
            for(let item of this.list) {
                total += item.sportBetRatio ? parseFloat(item.sportBetRatio) : 0.00;
                console.log(item.sportBetRatio)
            }
            console.log(total, '/', this.listLength)
            total = total / this.listLength

            return total;
        },
    },
    mounted() {
        this.initUserStore();
        this.getMyRevenue()
    },
    methods: {
        async initUserStore() {
            // await this.$store.dispatch('userStore/agentDetails')
            await this.$store.dispatch('userStore/myRevenue')

            this.summaryItems = [
                // {
                //     icon    : 'mdi mdi-cash-multiple',
                //     title   : 'Current Reserve Amount',
                //     summ    : this.$store.state.userStore ? this.$GF.formatNumComma(this.$store.state.userStore.realCash) : '-'
                // },
                {
                    icon    : 'mdi mdi-poker-chip',
                    title   : 'Gold Day Bet',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatNumComma(this.$store.state.userStore.record.totalBetAmount) : '-'
                },
                {
                    icon    : 'mdi mdi-creation',
                    title   : 'Gold Day Win',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatNumComma(this.$store.state.userStore.record.totalWinAmount) : '-'
                },
                {
                    icon    : 'mdi mdi-thumb-down-outline',
                    title   : 'Gold Day Loss',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatNumComma(this.$store.state.userStore.record.winLose) : '-'
                },
                {
                    icon    : 'mdi mdi-account-multiple-check',
                    title   : 'Gold Day Bet User',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatNumComma(this.$store.state.userStore.record.userCount) : '-'
                },
                {
                    icon    : 'mdi mdi-cards-spade',
                    title   : 'Casino Bet Ratio',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.casinoBetRatio) : '-'
                },
                {
                    icon    : 'mdi mdi-pokeball',
                    title   : 'Minigame Bet Ratio',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.minigameBetRatio) : '-'
                },
                {
                    icon    : 'mdi mdi-slot-machine-outline',
                    title   : 'Slot Bet Ratio',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.slotBetRatio) : '-'
                },
                {
                    icon    : 'mdi mdi-soccer',
                    title   : 'Sport Bet Ratio',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.sportBetRatio) : '-'
                },
            ]
        },
        async getMyRevenue() {
            try {
                const data = { 
                    Authorization   : `Bearer ${TOKEN}`,
                    token           : this.$store.state.userStore.token,
                    username        : this.$store.state.userStore.username, 
                    filter_agentid  : '', 
                    filter_startdate: `${this.firstDay} 00:00:00`, 
                    filter_enddate  : `${this.$GF.getDateTime(this.currDate, 'date')} 23:59:59`, 
                }
                const res   = await api.myRevenue(data)
                const code  = res.data.code;
                const msg   = res.data.message;

                if(code === 1) {
                    this.listLength = res.data.data.length
                    this.list = res.data.data
                    this.summaryItems2 = [
                        // {
                        //     icon    : 'mdi mdi-cash-multiple',
                        //     title   : 'Current Reserve Amount',
                        //     summ    : this.$store.state.userStore ? this.$GF.formatNumComma(this.$store.state.userStore.realCash) : '-'
                        // },
                        {
                            icon    : 'mdi mdi-poker-chip',
                            title   : 'This month Bet',
                            summ    : this.totalBetAmount ? this.$GF.formatNumComma(this.totalBetAmount) : '-'
                        },
                        {
                            icon    : 'mdi mdi-creation',
                            title   : 'This month Win',
                            summ    : this.totalWinAmount ? this.$GF.formatNumComma(this.totalWinAmount) : '-'
                        },
                        {
                            icon    : 'mdi mdi-thumb-down-outline',
                            title   : 'This month Loss',
                            summ    : this.winLose ? this.$GF.formatNumComma(this.winLose) : '-'
                        },
                        {
                            icon    : 'mdi mdi-account-multiple-check',
                            title   : 'This month Bet User',
                            summ    : this.userCount ? this.$GF.formatNumComma(this.userCount) : '-'
                        },
                        {
                            icon    : 'mdi mdi-cards-spade',
                            title   : 'Casino Bet Ratio',
                            summ    : this.casinoBetRatio ? this.$GF.formatTwoDecimal(this.casinoBetRatio) : '-'
                        },
                        {
                            icon    : 'mdi mdi-pokeball',
                            title   : 'Minigame Bet Ratio',
                            summ    : this.minigameBetRatio ? this.$GF.formatTwoDecimal(this.minigameBetRatio) : '-'
                        },
                        {
                            icon    : 'mdi mdi-slot-machine-outline',
                            title   : 'Slot Bet Ratio',
                            summ    : this.slotBetRatio ? this.$GF.formatTwoDecimal(this.slotBetRatio) : '-'
                        },
                        {
                            icon    : 'mdi mdi-soccer',
                            title   : 'Sport Bet Ratio',
                            summ    : this.sportBetRatio ? this.$GF.formatTwoDecimal(this.sportBetRatio) : '-'
                        },
                    ]
                } else {
                    
                }
            } catch (error) {
                console.error(error)
            } finally {
                this.isLoading2 = false
            }
        }
    }
 }
</script>
