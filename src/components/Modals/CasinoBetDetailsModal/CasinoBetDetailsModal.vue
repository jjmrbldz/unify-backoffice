<template>
    <Panel class="mb-3" :pt="{header: {class: 'hidden'}, content: {class: 'p-2'} }">
        <div class="grid mt-0">
            <div class="col-4">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Game ID`) }}</label>
                <div class="text-lg font-bold">{{ betData.game_id }}</div>
            </div>
            <div class="col">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Provider`) }}</label>
                <div class="text-lg font-bold capitalize"><ProviderID :id="betData.provider_id"/></div>
            </div>
            <div class="col">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Table ID`) }}</label>
                <div class="text-lg font-bold">{{ betDetails ? betDetails.table.id : betData.table_id }}</div>
            </div>
            <div class="col">
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Table Information`) }}</label>
                <div class="text-lg font-bold capitalize">{{ betDetails ? betDetails.table.name : betData.table_id }}</div>
            </div>
        </div>
    </Panel>
    <template v-if="betDetails && betData.provider_id === 'evo'">
        <Fieldset :legend="$store.getters['languageStore/translate'](`Game Result`)" :toggleable="true">
            <div v-if="betDetails.gameType === 'baccarat'" class="grid mt-0">
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-blue-500 m-auto">{{ betDetails.result.player.score }}</div>
                        </div>
                        <div class="">
                            <div class="flex gap-2" style="height: 100px;">
                                <template v-for="item in betDetails.result.player.cards">
                                    <template v-if="cards">
                                        <Transition name="flip">
                                            <Image v-if="cardsLoaded" height="100" :src="cards[item]" preview :pt="{image: {onLoad: handleImageLoad}}" />
                                        </Transition>
                                    </template>
                                    <template v-else>
                                        <Skeleton v-if="imageLoading" width="71px" height="100px" borderRadius="6px" />
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Player`) }}</div>
                </div>
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5 mt-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-green-500 m-auto">{{ betDetails.result.outcome }}</div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Result`) }}</div>
                </div>
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-red-500 m-auto">{{ betDetails.result.banker.score }}</div>
                        </div>
                        <div class="">
                            <div class="flex gap-2" style="height: 100px;">
                                <template v-for="item in betDetails.result.banker.cards">
                                    <template v-if="cards">
                                        <Transition name="flip">
                                            <Image v-if="cardsLoaded" height="100" :src="cards[item]" preview :pt="{image: {onLoad: handleImageLoad}}" />
                                        </Transition>
                                    </template>
                                    <template v-else>
                                        <Skeleton v-if="imageLoading" width="71px" height="100px" borderRadius="6px" />
                                    </template>
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Banker`) }}</div>
                </div>
            </div>
            <div v-else-if="betDetails.gameType === 'dragontiger'" class="grid mt-0">
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-red-500 m-auto">{{ betDetails.result.dragon.score }}</div>
                        </div>
                        <div class="">
                            <div class="flex gap-2" style="height: 100px; width: 71px;">
                                <template v-if="cards">
                                    <Transition name="flip">
                                        <Image v-if="cardsLoaded" height="100" :src="cards[betDetails.result.dragon.card]" preview :pt="{image: {onLoad: handleImageLoad}}" />
                                    </Transition>
                                </template>
                                <template v-else>
                                    <Skeleton v-if="imageLoading" width="71px" height="100px" borderRadius="6px" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Dragon`) }}</div>
                </div>
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5 mt-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-green-500 m-auto">{{ betDetails.result.outcome }}</div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Result`) }}</div>
                </div>
                <div class="col">
                    <div class="flex justify-content-center align-items-center gap-5">
                        <div class="">
                            <div class="text-3xl font-bold capitalize text-blue-500 m-auto">{{ betDetails.result.tiger.score }}</div>
                        </div>
                        <div class="">
                            <div class="flex gap-2" style="height: 100px; width: 71px;">
                                <template v-if="cards">
                                    <Transition name="flip">
                                        <Image v-if="cardsLoaded" height="100" :src="cards[betDetails.result.tiger.card]" preview :pt="{image: {onLoad: handleImageLoad}}" />
                                    </Transition>
                                </template>
                                <template v-else>
                                    <Skeleton v-if="imageLoading" width="71px" height="100px" borderRadius="6px" />
                                </template>
                            </div>
                        </div>
                    </div>
                    <div class="text-sm font-bold text-color-secondary text-center mt-3" for="">{{ $store.getters['languageStore/translate'](`Tiger`) }}</div>
                </div>
            </div>
        </Fieldset>
        <Fieldset  :legend="$store.getters['languageStore/translate'](`Bet Details`)" :toggleable="true">
            <div class="grid mt-0">
                <div class="col">
                    <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Amount`) }}</label>
                    <div class="text-lg font-bold capitalize">{{ this.$GF.formatNumComma(totalBetAmount) }}</div>
                </div>
                <div class="col">
                    <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Winnings`) }}</label>
                    <div class="text-lg font-bold capitalize">{{ this.$GF.formatNumComma(totalWinningAmount) }}</div>
                </div>
                <div class="col-3">
                    <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Time`) }}</label>
                    <div class="text-lg font-bold capitalize">{{ this.$GF.cleanString(betData.reg_datetime) }}</div>
                </div>
                <div class="col-3">
                    <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Transaction ID`) }}</label>
                    <div class="text-lg font-bold capitalize">{{ betData.txid ? betData.txid.replace('D', '') : betData.txid }}</div>
                </div>
            </div>
            <Divider />
            <div class="col">
                <!-- <div class="text-lg font-bold capitalize">{{ betDetails ? betDetails.participants[0].bets[0].code : betData.provider_id }}</div> -->
                <label class="text-sm font-bold text-color-secondary" for="">{{ $store.getters['languageStore/translate'](`Bet Code`) }}</label>
                <DataTable :value="betDetails.participants[0].bets" class="mt-2" stripedRows>
                    <Column :header="this.$store.getters['languageStore/translate'](`Transaction ID`)" style="">
                        <template #body="{ data }">
                            <span>{{ data.transactionId }}</span>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Code`)" style="">
                        <template #body="{ data }">
                            <span>{{ data.code }}</span>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Stake`)" style="">
                        <template #body="{ data }">
                            <span>{{ this.$GF.formatNumComma(data.stake) }}</span>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Payout`)" style="">
                        <template #body="{ data }">
                            <span>{{ this.$GF.formatNumComma(data.payout) }}</span>
                        </template>
                    </Column>
                    <Column :header="this.$store.getters['languageStore/translate'](`Placed On`)" style="">
                        <template #body="{ data }">
                            <span>{{ this.$GF.getDateTime(data.placedOn) }}</span>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </Fieldset>
    </template>
    <template v-if="otherDetails && resultDetails && betData.provider_id === 'micro'">
        <MicroDetails :bet-data="betData" :other-details="otherDetails" :result-details="resultDetails" />
    </template>
    <template v-if="otherDetails && betData.provider_id === 'pp'">
        <PragmaticDetails :bet-data="betData" :other-details="otherDetails" />
    </template>
</template>

<style>
.flip-enter-active {
  animation: flip-in 0.6s;
}
.flip-leave-active {
  animation: flip-in 0.6s reverse;
}
@keyframes flip-in {
  0% {
    transform: rotate3d(1, 1, 1, 120deg);
  }
  100% {
    transform: rotate3d(1, 1, 1, 0deg);
  }
}
</style>

<script>
import { importAllImages } from '@/utils/importAllImages';
export default {
    inject: ['dialogRef'],
    data() {
        return {
            betData     : this.dialogRef.data ? this.dialogRef.data.betData : null,
            betDetails  : this.dialogRef.data ? this.dialogRef.data.betDetails : null,
            resultDetails  : this.dialogRef.data ? this.dialogRef.data.resultDetails : null,
            otherDetails  : this.dialogRef.data ? this.dialogRef.data.otherDetails : null,
            loading     : this.dialogRef.data ? this.dialogRef.data.loading : false,
            cards       : null,
            imageLoading: true,
            cardsLoaded :false,
        }
    },
    watch: {
        cards: {
            handler(newVal, oldVal) {
                if(Object.keys(newVal).length >= 52) {
                    var s = setTimeout(() => {
                        this.cardsLoaded = true
                        clearTimeout(s)
                    }, 100)
                } else {
                    this.cardsLoaded = false
                }
            }
        }
    },
    computed: {
        totalBetAmount() {
            let total = 0;
            if(this.betDetails) {
                for(let item of this.betDetails.participants[0].bets) {
                    total += item.stake;
                }
    
                return total;
            } else {
                return total
            }
        },
        totalWinningAmount() {
            let total = 0;
            if(this.betDetails) {
                for(let item of this.betDetails.participants[0].bets) {
                    total += item.payout;
                }
    
                return total;
            } else {
                return total
            }
        },
    },
    async created() {
        const _cards = await importAllImages();
        this.cards = _cards;
    },
    mounted() {
        this.imageLoading = true
        this.loading = false
    },
    methods: {
        handleImageLoad(e) {
            console.log('Image loaded');
            this.imageLoading = false
        },
        providerHandler(provider) {
            if(provider) {
                if(provider === 'evo') {
                    return 'Evolution'
                } else if (provider === 'pp') {
                    return 'Pragmatic'
                } else {
                    return provider
                }
            } else {
                '-'
            }
        }
    }
}
</script>

<style lang="scss" scoped>
    :deep(th) {
        background-color: var(--surface-100) !important;
    }
</style>