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
    </Fieldset>
    <Fieldset :legend="$store.getters['languageStore/translate'](`Game Result`)" :toggleable="true">
        <ResultLink :agent-ID="betData.partner_username" :game-ID="betData.provider_id" :tx-ID="betData.txid" />
    </Fieldset>
</template>

<script>
export default {
    props: {
        betData: Object,
        otherDetails: Object,
        resultDetails: Object
    },
    data() {
        return {
            // betData1: this.otherDetails ? JSON.parse(this.otherDetails.betData) : null,
            // betData2: this.resultDetails ? JSON.parse(this.resultDetails.betData) : null
        }
    },
    mounted() {
        // console.log(this.otherDetails, this.betData1);
        // console.log(this.resultDetails, this.betData2);
    },
    methods: {
        
    }
}
</script>