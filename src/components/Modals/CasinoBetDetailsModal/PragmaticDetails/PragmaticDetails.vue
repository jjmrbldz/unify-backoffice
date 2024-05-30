<template>
    <Fieldset :legend="$store.getters['languageStore/translate'](`Bet Details`)" :toggleable="true">
        <div class="grid mt-0">
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Session ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ otherDetails.session.id }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Session IP`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ otherDetails.session.ip }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`User ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ otherDetails.user_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ otherDetails.amount }}</div>
            </div>
        </div>
        <Divider />
        <div class="grid">
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Hash`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.hash }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Reference`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.reference }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round Details`) }}</label>
                <div class="text-sm text-wrap font-bold capitalize">{{ betData1.roundDetails }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold capitalize">{{ betData1.roundId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Game ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.gameId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Provider ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.providerId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`User ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.userId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(parseInt(betData1.timestamp)) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.cash_before }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.transactionId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.transaction_type }}</div>
            </div>
        </div>
    </Fieldset>
    <Fieldset :legend="$store.getters['languageStore/translate'](`Game Result`)" :toggleable="true">
        <div class="grid mt-0">
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`User ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ resultDetails.user_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ resultDetails.bet_amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Result`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ resultDetails.bet_result }}</div>
            </div>
        </div>
        <Divider />
        <div class="grid">
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Hash`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.hash }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Reference`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.reference }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round Details`) }}</label>
                <div class="text-sm text-wrap font-bold capitalize">{{ betData2.roundDetails }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold capitalize">{{ betData2.roundId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Game ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.gameId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Provider ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.providerId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`User ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.userId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(parseInt(betData2.timestamp)) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.cash_before }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.transactionId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.transaction_type }}</div>
            </div>
        </div>
    </Fieldset>
</template>

<script>
export default {
    props: {
        otherDetails: Object,
        resultDetails: Object
    },
    data() {
        return {
            betData1: this.otherDetails ? JSON.parse(this.otherDetails.betData) : null,
            betData2: this.resultDetails ? JSON.parse(this.resultDetails.betData) : null
        }
    },
    mounted() {
        console.log(this.otherDetails, this.betData1);
        console.log(this.resultDetails, this.betData2);
    }
}
</script>