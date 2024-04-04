<template>
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
</template>

<script>
import { mapGetters } from 'vuex';
 export default {
    data() {
        return {
            summaryItems: [],
            // isLoading: true,
        }
    },
    computed: {
        ...mapGetters('userStore', ['isLoading'])
    },
    mounted() {
        console.log('aa');
        this.initUserStore();
    },
    methods: {
        async initUserStore() {
            // await this.$store.dispatch('userStore/agentDetails')
            await this.$store.dispatch('userStore/myRevenue')

            this.summaryItems = [
                {
                    icon    : 'mdi mdi-cash-multiple',
                    title   : 'Current Reserve Amount',
                    summ    : this.$store.state.userStore ? this.$GF.formatTwoDecimal(this.$store.state.userStore.realCash) : '-'
                },
                {
                    icon    : 'mdi mdi-poker-chip',
                    title   : 'Gold Day Bet',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.totalBetAmount) : '-'
                },
                {
                    icon    : 'mdi mdi-creation',
                    title   : 'Gold Day Win',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.totalWinAmount) : '-'
                },
                {
                    icon    : 'mdi mdi-thumb-down-outline',
                    title   : 'Gold Day Loss',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.winLose) : '-'
                },
                {
                    icon    : 'mdi mdi-account-multiple-check',
                    title   : 'Gold Day Bet User',
                    summ    : this.$store.state.userStore.record ? this.$GF.formatTwoDecimal(this.$store.state.userStore.record.betCount) : '-'
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
        }
    }
 }
</script>
