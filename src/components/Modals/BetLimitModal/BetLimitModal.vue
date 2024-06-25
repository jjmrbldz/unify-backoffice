<template>
    <DataTable :value="list" class="mt-4" rowGroupMode="rowspan" groupRowsBy="codeId" :loading="loading">
        <Column field="title" :header="this.$store.getters['languageStore/translate'](`Type`)" style="background-color: var(--surface-100);">
            <template #body="{ data }">
                <span>{{ data.title }}</span>
            </template>
        </Column>
        <Column field="min_bet" :header="this.$store.getters['languageStore/translate'](`MIN`)" style="">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.min_bet) }}</span>
            </template>
        </Column>
        <Column field="max_bet" :header="this.$store.getters['languageStore/translate'](`MAX`)" style="">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.max_bet) }}</span>
            </template>
        </Column>
        <Column field="codeId" :header="this.$store.getters['languageStore/translate'](`Code`)" style="text-align: center;">
            <template #body="{ data }">
                <span>{{ data.codeId }}</span>
            </template>
        </Column>
        <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
    </DataTable>
    <Paginator v-if="false"
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
            gameCode    : this.dialogRef.data ? this.dialogRef.data.gameCode : null,
            loading     : false,
            list        : [],
            params      : {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                page            : 1,
                items_count     : 9999
                // filter_agentid  : this.dialogRef ? this.dialogRef.data.agentID :this.$store.state.userStore.username,
            },
            totalCount: null,
        }
    },
    mounted() {
        this.getList()
        console.log('Limit List Mounted')
    },
    methods: {
        handlePagination(data) {
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                const res   = await api.getBetLimitList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    const _list = res.data.data
                    let arr = []
                    _list.map((item) => {
                        const _betLimit = JSON.parse(item.betLimit)
                        // console.log(_betLimit)
                        _betLimit.map((limitItem) => {
                            arr.push({
                                ...limitItem,
                                gameCode: item.gameCode,
                                codeId: item.codeId,
                            })
                        })
                        
                    })
                    console.log('New Limit List:', arr)
                    this.list = arr;
                    this.totalCount = res.data.totalCount
                    // if(this.mypage) {
                    //     this.filterActiveCasino();
                    // }
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                    this.totalCount = null
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading    = false
            }
        },
    }
}
</script>

<style lang="scss" scoped>
    :deep(th) {
        background-color: var(--surface-100) !important;
    }
</style>