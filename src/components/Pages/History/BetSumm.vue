<template>
    <div class="flex align-items-center gap-6 text-sm text-600">
        <div class="font-bold">{{ $store.getters['languageStore/translate']('Sum') }}: </div>
        <div class="text-center">
            <div class="font-bold">{{ $store.getters['languageStore/translate']('Bet') }}</div>
            <div class="" :class="this.$GF.handleTextColor($store.state.betSummStore.betSumm.totalBet)">{{ $GF.formatNumComma($store.state.betSummStore.betSumm.totalBet) }}</div>
        </div>
        <div class="text-center">
            <div class="font-bold">{{ $store.getters['languageStore/translate']('Winning') }}</div>
            <div class="" :class="this.$GF.handleTextColor($store.state.betSummStore.betSumm.totalWinning)">{{ $GF.formatNumComma($store.state.betSummStore.betSumm.totalWinning) }}</div>
        </div>
        <div class="text-center">
            <div class="font-bold">{{ $store.getters['languageStore/translate']('Profit & Loss') }}</div>
            <div class="" :class="this.$GF.handleTextColor($store.state.betSummStore.betSumm.totalProfitLoss)">{{ $GF.formatNumComma($store.state.betSummStore.betSumm.totalProfitLoss) }}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'BetSumm',
    data() {
        return {

        }
    }
}
</script>