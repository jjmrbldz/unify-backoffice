<template>
    <DataTable :value="[betData]" class="mt-4" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="">
            <template #body="{ data }">
                <span>{{ data.user_username }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reserve ID`)" style="">
            <template #body="{ data }">
                <span>{{ data.reserveID }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Type`)" style="">
            <template #body="{ data }">
                <span>{{ data.betType }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Live?`)" style="text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.isLive === 1" severity="success" :value="$store.getters['languageStore/translate'](`Live`)"></Tag>
                <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Prematch`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Odds Total`)" style="">
            <template #body="{ data }">
                <Tag severity="secondary" :value="data.oddsTotal"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Amount`)" style="">
            <template #body="{ data }">
                <div class="text-xs white-space-nowrap">
                    <span class="text-red-500">{{ this.$store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.betAmount)">{{ this.$GF.formatTwoDecimal(data.betAmount) }}</span>
                </div>
                <div class="text-xs my-1 white-space-nowrap">
                    <span class="text-blue-500">{{ this.$store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.expectedAmount)">{{ this.$GF.formatTwoDecimal(data.expectedAmount) }}</span>
                </div>
                <div class="text-xs white-space-nowrap">
                    <span class="text-green-500">{{ this.$store.getters['languageStore/translate'](`winningAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.winningAmount)">{{ this.$GF.formatTwoDecimal(data.winningAmount) }}</span>
                </div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Result`)" style="">
            <template #body="{ data }">
                <Tag v-if="data.status === 'Opened'" severity="info" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Lost'" severity="danger" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Won'" severity="success" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Canceled'" severity="warning" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Cashout'" severity="primary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Lost'" style="background: color-mix(in srgb, var(--pink-500), transparent 80%); color: var(--pink-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else severity="secondary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`dateLang`)" style="">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(data.reg_datetime) }}</span>
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <DataTable :value="betDetails" class="mt-4 text-xs" stripedRows :loading="loading">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Sport`)">
            <template #body="{ data }">
                <span>{{ data.sportsName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`League`)">
            <template #body="{ data }">
                <span>{{ data.leagueName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Match Name`)">
            <template #body="{ data }">
                <span>{{ data.matchName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Home`)">
            <template #body="{ data }">
                <span>{{ data.homeName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Score`)">
            <template #body="{ data }">
                <span>{{ data.score }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Betting Score`)">
            <template #body="{ data }">
                <span>{{ data.bettingScore }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Away`)">
            <template #body="{ data }">
                <span>{{ data.awayName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Betting Name`)">
            <template #body="{ data }">
                <span>{{ data.bettingName }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Value`)">
            <template #body="{ data }">
                <span>{{ data.betVal }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Allocation`)">
            <template #body="{ data }">
                <Tag severity="secondary" :value="data.allocation"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Benchmark`)">
            <template #body="{ data }">
                <span :class="this.$GF.handleTextColor(data.bechmark)">{{ data.bechmark }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Live?`)" style="text-transform: capitalize; min-width: 100px;">
            <template #body="{ data }">
                <Tag v-if="data.matchType === 1" severity="success" :value="$store.getters['languageStore/translate'](`Live`)"></Tag>
                <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Not Live`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Result`)">
            <template #body="{ data }">
                <Tag v-if="data.status === 'Opened'" severity="info" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Lost'" severity="danger" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Won'" severity="success" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Canceled'" severity="warning" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Cashout'" severity="primary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Lost'" style="background: color-mix(in srgb, var(--pink-500), transparent 80%); color: var(--pink-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else severity="secondary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Game Date`)">
            <template #body="{ data }">
                <span >{{ this.$GF.getDateTime(`${data.matchDateTime}Z`) }}</span>
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
            loading     : this.dialogRef.data ? this.dialogRef.data.loading : false,
        }
    },
    mounted() {
        console.log(this.betData, this.betDetails);
        this.loading = false
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