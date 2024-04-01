<template>
    <div class="dashSumm">
        <div class="dashSummList">
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Current Reserve Amount') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.realCash) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Gold Day Bet') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.totalBetAmount) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Gold Day Win') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.totalWinAmount) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Gold Day Loss') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.winLose) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Gold Day Bet User') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.betUser) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Casino Bet Ratio') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.casinoBetRatio) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Minigame Bet Ratio') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.minigameBetRatio) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Slot Bet Ratio') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.slotBetRatio) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
            <Card>
                <template #content>
                    <div class="dashSummItem">
                        <div class="summIcon">
                            <span class="mdi mdi-cash-multiple"></span>
                        </div>
                        <div class="summContent">
                            <div class="title">{{ $store.getters['languageStore/translate']('Sport Bet Ratio') }}</div>
                            <div class="summ">{{ this.$GF.formatTwoDecimal($store.state.userStore.record.sportBetRatio) }}</div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>
</template>

<script>

</script>
