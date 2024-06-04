<template>
    <Fieldset :legend="$store.getters['languageStore/translate'](`Game Result`)" :toggleable="true">
        <ResultLink :agent-ID="betData.partner_username" :game-ID="betData.provider_id" :tx-ID="betData1.transactionId" />
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
            betData1: this.otherDetails ? JSON.parse(this.otherDetails.betData) : null,
            betData2: this.resultDetails ? JSON.parse(this.resultDetails.betData) : null
        }
    },
    mounted() {
        console.log(this.otherDetails, this.betData1);
        console.log(this.resultDetails, this.betData2);
    },
    methods: {
        
    }
}
</script>