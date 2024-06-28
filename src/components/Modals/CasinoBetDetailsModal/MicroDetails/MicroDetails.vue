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
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.txnId }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Operator Token`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.extOperatorToken }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.txnType }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Event Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.txnEventType }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Player ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.playerId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.currency }} {{ betData1.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(betData1.creationTimeMs) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.roundId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Completed`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.completed ? 'YES' : 'NO' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Channel`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.channel }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.cashBefore }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Ext Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.extTxnId }}</div>
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
                <div class="text-sm text-wrap font-bold">{{ betData1.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Result`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ resultDetails.bet_result }}</div>
            </div>
        </div>
        <Divider />
        <div class="grid">
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.txnId }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Operator Token`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.extOperatorToken }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.txnType }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Event Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.txnEventType }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Player ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.playerId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.currency }} {{ betData2.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(betData2.creationTimeMs) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.roundId }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Completed`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.completed ? 'YES' : 'NO' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Channel`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.channel }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.cashBefore }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Ext Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.extTxnId }}</div>
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