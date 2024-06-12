<template>
    <Object :data="pdfUrl" type="application/pdf" width="100%" height="600px">
        <p>Alternative text - include a link to the PDF!</p>
    </Object>
</template>

<script>
import apidoc from '@/assets/SmartApi_SingleWallet_2024-v0.60.pdf'
import apidoc2 from '@/assets/Kosca_SingleWallet_2024-v0.7 (kr).pdf'
import apidoc3 from '@/assets/KoscaApi_Seamless_2024-v1.02 (kr).pdf'
import apidoc4 from '@/assets/KoscaApi_Seamless_2024(kr).pdf'
import apidoc5 from '@/assets/KoscaApi_SingleWallet_2024-v1.2 (kr).pdf'

export default {
    data() {
        return {
            pdfUrl: apidoc5,
        }
    },
}
</script>