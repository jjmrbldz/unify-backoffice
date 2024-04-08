<template>
    <Object :data="pdfUrl" type="application/pdf" width="100%" height="600px">
        <p>Alternative text - include a link to the PDF!</p>
    </Object>
</template>

<script>
import apidoc from '@/assets/SmartApi_SingleWallet_2024-v0.60.pdf'

export default {
    data() {
        return {
            pdfUrl: apidoc,
        }
    },
}
</script>