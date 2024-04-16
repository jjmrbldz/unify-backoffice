<template>
    <DataTable :value="[betData]" scrollable class="mt-4" stripedRows>
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.user_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.txid }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Game Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <span>{{ data.game_type }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Table ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.table_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.type === 'credit'" severity="danger" :value="$store.getters['languageStore/translate'](`creditLang`)"></Tag>
                <Tag v-else severity="info" :value="$store.getters['languageStore/translate'](`debitLang`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" class="text-right" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatTwoDecimal(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 1" severity="success" :value="$store.getters['languageStore/translate'](`NORMAL`)"></Tag>
                <Tag v-else severity="danger" :value="$store.getters['languageStore/translate'](`FAILED`)"></Tag>
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <DataTable :value="[betDetails]" scrollable class="mt-4" stripedRows>
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.user_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.txid }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Game Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <span>{{ data.game_type }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Table ID`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.table_id }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Type`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.type === 'credit'" severity="danger" :value="$store.getters['languageStore/translate'](`creditLang`)"></Tag>
                <Tag v-else severity="info" :value="$store.getters['languageStore/translate'](`debitLang`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.partner_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" class="text-right" style="min-width: 100px">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.amount)">{{ this.$GF.formatTwoDecimal(data.amount) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="min-width: 100px">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Status`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 1" severity="success" :value="$store.getters['languageStore/translate'](`NORMAL`)"></Tag>
                <Tag v-else severity="danger" :value="$store.getters['languageStore/translate'](`FAILED`)"></Tag>
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
            betData     : this.dialogRef.data ? this.dialogRef.data.betData : null,
            betDetails  : this.dialogRef.data ? this.dialogRef.data.betDetails : null,
        }
    },
    mounted() {
        console.log(this.betData, this.betDetails);
    },
    methods: {
        
    }
}
</script>

<style lang="scss" scoped>
    :deep(th) {
        background-color: var(--surface-100) !important;
    }
</style>