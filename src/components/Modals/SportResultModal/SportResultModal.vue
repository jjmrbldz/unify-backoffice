<template>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading" size="small">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 200px">
            <template #body="{ data }">
                <div>{{ data.cust_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <div>{{ data.trx_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reserve ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <div>{{ data.reserve_id }}</div>
                <div>{{ data.purchase_id }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash Before`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.cash_before)">{{ this.$GF.formatNumComma(data.cash_before) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatNumComma(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Cash After`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(data.cash_after)">{{ this.$GF.formatNumComma(data.cash_after) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="JSON.parse(data.response)['status'] === 0" severity="success" :value="$store.getters['languageStore/translate'](`Success`)"></Tag>
                <Tag v-else severity="danger" :value="$store.getters['languageStore/translate'](`Error`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Balance`)" style="min-width: 100px">
            <template #body="{ data }">
                <span class="" :class="this.$GF.handleTextColor(JSON.parse(data.response)['balance'])">{{ this.$GF.formatNumComma(JSON.parse(data.response)['balance']) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.cleanString(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Details`)" style="min-width: 100px">
            <template #body="{ data }">
                <div class="flex align-items-center gap-2">
                    <!-- <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'sport')" /> -->
                    <Button icon="mdi mdi-send" severity="success" @click="handleSendResult(data, 'sport', true)" />
                    <Button icon="mdi mdi-send-clock" severity="info" @click="handleSendResult(data, 'sport', false)" />
                </div>
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
</template>

<script>
import { api, TOKEN } from '@/axios/api';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading     : false,
            params      : {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_reserve_id: this.dialogRef.data ? this.dialogRef.data.reserveID : null,
            },
            list: [],
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async getList() {
            this.loading = true
            try {

                const res   = await api.sportCreditList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

                if(code === 1) {
                    this.list = res.data.data;
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async handleSendResult(data, type, bool) {
            const { myurl, myjson, id } = data

            if(myurl && myjson) {
                const reqBody = {
                    Authorization: `Bearer ${TOKEN}`,
                    username    : this.$store.state.userStore.username,
                    token       : this.$store.state.userStore.token,
                    url         : myurl,
                    result      : myjson,
                    filter_id   : id,
                    send_agent  : bool,
                }

                let formData = new FormData()

                formData.append('Authorization', reqBody.Authorization)
                formData.append('username', reqBody.username)
                formData.append('token', reqBody.token)
                formData.append('url', reqBody.url)
                formData.append('result', reqBody.result)
                formData.append('filter_id', `${reqBody.filter_id}`)
                formData.append('send_agent', reqBody.send_agent)

                console.log(reqBody);
                try {
                    const res = await api.sendResult(formData)
                    const code  = res.data.status;
                    const msg   = res.data.message;
                    console.log(res.data);

                    if(code == 0) {
                        let _msg = `${res.data.transaction_id} ${res.data.error_code ? res.data.error_code : ''} Balance: ${res.data.balance}`
                        this.$GF.customToast(1, _msg)
                        
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                    
                } catch (e) {
                    console.error(e)
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                } finally {
                    this.getList()
                }
            } else {
                this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Match is not finished`))
            }
        },
    }
}
</script>