<template>
    <div class="flex justify-content-between align-items-center px-4">
        <BetSumm :show-sports="true" />
    </div>
    <Divider />
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading" size="small">
        <Column :header="this.$store.getters['languageStore/translate'](`Number`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.idx }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Agent Name`)" style="min-width: 100px">
            <template #body="{ data }">
                <div>{{ data.partner_username }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`User ID`)" style="min-width: 200px">
            <template #body="{ data }">
                <div>{{ data.user_username }}</div>
                <template v-if="data.user_id">
                    <div class="">{{ data.user_id }}</div>
                </template>
                <template v-else>
                    <div class="">{{ data.placebetjson ? JSON.parse(data.placebetjson)['user_id'] : '-' }}</div>
                </template>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Vendor`)" style="min-width: 100px">
            <template #body="{ data }">
                <ProviderID id="bti" />
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Reserve ID`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <div>{{ data.reserveID }}</div>
                <div>{{ data.purchaseID }}</div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Bet Type`)" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.betType }}</span>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Live?`)" style="min-width: 100px; text-transform: capitalize;">
            <template #body="{ data }">
                <Tag v-if="data.isLive === 1" severity="success" :value="$store.getters['languageStore/translate'](`Live`)"></Tag>
                <Tag v-else severity="warning" :value="$store.getters['languageStore/translate'](`Prematch`)"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Odds Total`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag severity="secondary" :value="data.oddsTotal"></Tag>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Winnings`)" style="min-width: 100px">
            <template #body="{ data }">
                <div class="text-xs white-space-nowrap">
                    <span class="text-red-500">{{ this.$store.getters['languageStore/translate'](`betAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.betAmount)">{{ this.$GF.formatNumComma(data.betAmount) }}</span>
                </div>
                <div class="text-xs my-1 white-space-nowrap">
                    <span class="text-blue-500">{{ this.$store.getters['languageStore/translate'](`expectedAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.expectedAmount)">{{ this.$GF.formatNumComma(data.expectedAmount) }}</span>
                </div>
                <div class="text-xs white-space-nowrap">
                    <span class="text-green-500">{{ this.$store.getters['languageStore/translate'](`winningAmountLang`) }}: </span>
                    <span class="font-semibold" :class="this.$GF.handleTextColor(data.winningAmount)">{{ this.$GF.formatNumComma(data.winningAmount) }}</span>
                </div>
            </template>
        </Column>
        <Column :header="this.$store.getters['languageStore/translate'](`Result`)" style="min-width: 100px">
            <template #body="{ data }">
                <Tag v-if="data.status === 'Opened'" severity="info" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Lost'" severity="danger" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Won'" severity="success" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Canceled'" severity="warning" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Cashout'" severity="primary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Lost'" style="background: color-mix(in srgb, var(--pink-500), transparent 80%); color: var(--pink-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else-if="data.status === 'Half Won'" style="background: color-mix(in srgb, var(--indigo-500), transparent 80%); color: var(--indigo-500);" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
                <Tag v-else severity="secondary" :value="$store.getters['languageStore/translate'](`${data.status}`)"></Tag>
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
                    <Button icon="mdi mdi-eye" severity="info" @click="showBetDetails(data, 'sport')" />
                    <Button v-if="data.resultDetails && data.myurl " icon="mdi mdi-receipt-text-send" severity="success" @click="showResultModal(data)" />
                </div>
            </template>
        </Column>
        <Column field="ratio" :header="this.$store.getters['languageStore/translate'](`BTI Result`)">
            <template #body="{ data }">
                <span v-if="data.resultDetails">{{ data.ratio }}</span>
                <span v-else>-</span>
                <!-- <span>{{ data.ratio }}</span> -->
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator
        template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown "
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
        :rows="params.items_count"
        :totalRecords="totalCount"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        @page="handlePagination"
        >
    </Paginator>
</template>

<script>
import { api, TOKEN } from '@/axios/api';

export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading: false,
            params: {
                Authorization       : `Bearer ${TOKEN}`,
                username            : this.$store.state.userStore.username,
                token               : this.$store.state.userStore.token,
                page                : 1,
                items_count         : 100,
                filter_sportsName   : this.dialogRef.data ? this.dialogRef.data.sportsName : null,
                filter_leagueName   : this.dialogRef.data ? this.dialogRef.data.leagueName : null,
                filter_matchDateTime: this.dialogRef.data ? this.dialogRef.data.matchDateTime : null,
                filter_eventName    : this.dialogRef.data ? this.dialogRef.data.eventName : null,
                filter_bettingName  : this.dialogRef.data ? this.dialogRef.data.bettingName : null,
                filter_matchName    : this.dialogRef.data ? this.dialogRef.data.matchName : null,
            },
            list: [],
        }
    },
    computed: {
        // totalHomeBetAmount() {
        //     for (var item in this.betDetails) {

        //     }
        // }
    },
    mounted() {
        this.getList()
    },
    methods: {
        async showBetDetails(data, type) {
            if(type === 'sport') {
                const _data     = data;
                const details   = data.betDetails ? JSON.parse(data.betDetails) : null;
                const _details   = data.betdetails ? JSON.parse(data.betdetails) : null;
                const resultDetails = data.details ? JSON.parse(data.resultDetails) : null;
                const otherDetails = data.details ? JSON.parse(data.details) : null;

                this.$dialog.open(this.$modalComponent[type === 'sport' ? 'BetDetails' : 'CasinoBetDetails'], {
                    props: {
                        header: `${this.$store.getters['languageStore/translate'](`detailLang`)} - ${_data.user_username}`,
                        style: {
                            width: '80vw'
                        },
                        modal: true,
                        maximizable: true,
                        dismissableMask: true,
                    },
                    data: {
                        betData     : _data,
                        betDetails  : type === 'sport' ? details : _details,
                        resultDetails: resultDetails,
                        otherDetails: otherDetails,
                        loading     : true,
                    },
                    onClose: (options) => {
                        // this.getList();
                    }
                });
            } else {

                try {
                    const reqBody = {
                        Authorization   : `Bearer ${TOKEN}`,
                        username        : this.$store.state.userStore.username,
                        token           : this.$store.state.userStore.token,
                        filter_game_id  : data.provider_id,
                        filter_details  : data.details,
                        filter_betdetails: data.betdetails,
                    }
                    const res = await api.getBetDetails(reqBody)
                    const code  = res.data.code;
                    const msg   = res.data.message;
                    console.log(res.data.data[0]);
    
                    if(code == 1) {
                        
                        const _data     = data;
                        const details   = data.betDetails ? JSON.parse(data.betDetails) : null;
                        const _details   = res.data.data[0].betdetails ? JSON.parse(res.data.data[0].betdetails) : null;
                        const resultDetails = res.data.data[0].resultDetails ? JSON.parse(res.data.data[0].resultDetails) : null;
                        const otherDetails = res.data.data[0].details ? JSON.parse(res.data.data[0].details) : null;
    
                        this.$dialog.open(this.$modalComponent[type === 'sport' ? 'BetDetails' : 'CasinoBetDetails'], {
                            props: {
                                header: `${this.$store.getters['languageStore/translate'](`detailLang`)} - ${_data.user_username}`,
                                style: {
                                    width: '80vw'
                                },
                                modal: true,
                                maximizable: true,
                                dismissableMask: true,
                            },
                            data: {
                                betData     : _data,
                                betDetails  : type === 'sport' ? details : _details,
                                resultDetails: resultDetails,
                                otherDetails: otherDetails,
                                loading     : true,
                            },
                            onClose: (options) => {
                                // this.getList();
                            }
                        });
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                        
                } catch (e) {
                    console.error(e)
                    // this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            }
            
        },
        showResultModal(data) {
            const {user_username, reserveID} = data

            this.$dialog.open(this.$modalComponent.SportResult, {
                props: {
                    header: `${this.$store.getters['languageStore/translate'](`Send Result`)} - ${user_username} (${reserveID})`,
                    style: {
                        width: '80vw'
                    },
                    modal: true,
                    maximizable: true,
                    dismissableMask: true,
                },
                data: {
                    reserveID: reserveID
                },
                onClose: (options) => {
                    // this.getList();
                }
            });
        },
        handlePagination(data) {
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {

                const res   = await api.recordHistoryListNewDeets(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data;

                    this.totalCount = res.data.totalCount
                    this.$store.dispatch('betSummStore/setBetSumm', res.data.betSumm)
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                    this.totalCount = null
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
    }
}
</script>