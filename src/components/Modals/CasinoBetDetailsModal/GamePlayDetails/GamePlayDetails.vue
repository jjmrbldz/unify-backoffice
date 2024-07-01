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
                <div class="text-sm text-wrap font-bold">{{ otherDetails.transaction_id }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Operator Token`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ `${betData1.operator} - ${betData1.merch_pwd}` }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.txnType ? betData1.txnType : '-' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Event Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.txnEventType ? betData1.txnEventType : '-' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Player ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ otherDetails.user_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.currency }} {{ betData1.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(betData2.bh_date_time) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.round_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Completed`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.completed ? 'YES' : 'NO' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Channel`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_game_type }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.cash_before }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Ext Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.extTxnId ? betData1.extTxnId : '-' }}</div>
            </div>
        </div>
    </Fieldset>
    <Fieldset :legend="$store.getters['languageStore/translate'](`Game Result`)" :toggleable="true">
        <div class="grid mt-0">
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`User ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.cust_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.amount }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Result`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_balance }}</div>
            </div>
        </div>
        <Divider />
        <div class="grid">
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData1.trx_id }}</div>
            </div>
            <div class="col-6">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Operator Token`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ `${betData1.operator} - ${betData1.merch_pwd}` }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.txnType ? betData2.txnType : '-' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Event Type`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.txnEventType ? betData2.txnEventType : '-' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Player ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_user_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Amount`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_currency }} {{ betData2.bh_bet }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Date`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ this.$GF.getDateTime(betData2.bh_trans_date) }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Round ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_round_id }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Completed`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.completed ? 'YES' : 'NO' }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Channel`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_game_type }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Cash Before`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.bh_balance }}</div>
            </div>
            <div class="col-2">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Ext Transaction ID`) }}</label>
                <div class="text-sm text-wrap font-bold">{{ betData2.extTxnId ? betData2.extTxnId : '-' }}</div>
            </div>
        </div>
    </Fieldset>
</template>

<script>
export default {
    props: {
        otherDetails: Object,
        betDetails: Object
    },
    data() {
        return {
            betData1: this.otherDetails ? JSON.parse(this.otherDetails.betData) : null,
            betData2: this.betDetails ? this.betDetails[0] : null
        }
    },
    mounted() {
        console.log('Bet Data 1 (Other Details - details)', this.otherDetails, this.betData1);
        console.log('Bet Data 2 (Bet Details - betdetails)', this.betDetails, this.betData2);
    }
}
</script>