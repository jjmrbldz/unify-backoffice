<template>
    <Button v-if="!showAdd" severity="success" :label="$store.getters['languageStore/translate'](`Add Limit`)" @click="showAdd = true" />
    <Panel v-else header="Add Bet Limit">
        <template #icons>
            <Button icon="mdi mdi-close" text rounded @click="handleAddBetLimitClose" />
        </template>
        <div class="field">
            <label for="">{{ $store.getters['languageStore/translate'](`Code`) }}</label>
            <CodeIDSelect v-model="selectedCodeID" placeholder="Code" />
        </div>
        <Divider />
        <DataTable class="mb-3" v-if="selectedCodeID" :value="JSON.parse(selectedCodeID.betLimit)">
            <Column field="title" :header="this.$store.getters['languageStore/translate'](`Type`)" style="background-color: var(--surface-50);">
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
        </DataTable>
        <Button severity="info" :label="$store.getters['languageStore/translate'](`Submit`)" @click="addBetLimit" />
    </Panel>
    <DataTable :value="list" class="mt-4" rowGroupMode="rowspan" :groupRowsBy="['gameCode', 'codeId']" editMode="cell" @cell-edit-init="onCellEditInit" @cell-edit-complete="onCellEditComplete" @cell-edit-cancel="onCellEditCancel" :loading="loading">
        <Column field="gameCode" :header="this.$store.getters['languageStore/translate'](`Provider`)" style="background-color: var(--surface-100);">
            <template #body="{ data }">
                <span>{{ data.gameCode }}</span>
            </template>
        </Column>
        <Column field="codeId" :header="this.$store.getters['languageStore/translate'](`Code`)" style="text-align: center;">
            <template #body="{ data }">
                <span>{{ data.codeId }}</span>
            </template>
            <template #editor="{ data, field, index, editorCancelCallback }">
                <CodeIDSelect v-model="selectedCodeID" :placeholder="list[index][field]" :cancel-edit="editorCancelCallback" @keydown.escape="editorCancelCallback" />
                <!-- <InputText class="w-full" v-model="limitData.codeid" :placeholder="list[index][field]" /> -->
            </template>
        </Column>
        <Column field="betLimit" :header="this.$store.getters['languageStore/translate'](`Bet Limit`)">
            <template #body="{ data }">
                <DataTable :value="selectedCodeID ? JSON.parse(selectedCodeID.betLimit) : JSON.parse(data.betLimit)">
                    <Column field="title" :header="this.$store.getters['languageStore/translate'](`Type`)" style="background-color: var(--surface-50);">
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
                </DataTable>
            </template>
        </Column>
        <Column field="codeId" :header="this.$store.getters['languageStore/translate'](`Action`)">
            <template #body="{ data }">
                <Button v-if="limitData.gamecode === data.gameCode" :label="$store.getters['languageStore/translate']('Save')" @click="handleSaveBetLimit(data.codeId)" />
            </template>
        </Column>
        <!-- <template #empty> <div class="text-center text-red-500"> {{ this.$store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template> -->
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
                filter_agentid  : this.dialogRef.data ? this.dialogRef.data.agentID : null,
                token           : this.$store.state.userStore.token,
                page            : 1,
                items_count     : 9999
                // filter_agentid  : this.dialogRef ? this.dialogRef.data.agentID :this.$store.state.userStore.username,
            },
            limitData: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : this.dialogRef.data.agentID,
                codeid          : '',
                gamecode        : '',
            },
            totalCount: null,
            showAdd: false,
            selectedCodeID: null
        }
    },
    watch: {
        selectedCodeID: {
            handler(newVal, oldVal) {
                if(newVal) {
                    this.limitData.codeid = newVal.codeId
                    this.limitData.gamecode = newVal.gameCode
                } else {
                    this.limitData.codeid = ''
                    this.limitData.gamecode = ''
                }
            }
        }
    },
    mounted() {
        this.getList()
        console.log('Limit List Mounted')
        console.log('GameCode', this.gameCode)
    },
    methods: {
        handleAddBetLimitClose() {
            this.showAdd = false
            this.limitData.gamecode = null
            this.limitData.codeid = ''
        },
        async addBetLimit() {
            console.log(this.limitData)
            if(this.limitData.codeid) {
                try {
                    const res   = await api.updateBetLimit(this.limitData);
                    const code  = res.data.code;
                    const msg   = res.data.message;
                    console.log(res);
    
                    if(code === 1) {
                        this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                        this.showAdd = false
                        this.getList()
                        this.limitData.codeid = ''
                    } else {
                        this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    }
                } catch (error) {
                    console.error(error)
                    throw error
                }
            } else {
                this.$GF.customToast(0, this.$store.getters['languageStore/translate'](`Code ID is required!`))
            }
        },
        async handleSaveBetLimit(codeId) {
            try {

                console.log(this.limitData)
                const res   = await api.updateBetLimit(this.limitData);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.getList()
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.limitData.gamecode = null
                this.limitData.codeid = ''
                this.selectedCodeID = null
            }
        },
        onCellEditCancel(event) {
            this.limitData.gamecode = null
            this.limitData.codeid = ''
            this.selectedCodeID = null
        },
        onCellEditInit(event) {
            const { data } = event
            this.limitData.gamecode = data.gameCode
        },
        onCellEditComplete(event) {
            let { data, newValue, field, newData, index, value } = event;
            const {title, min_bet, max_bet, gameCode, codeId} = data

            if(newValue !== value) {
                this.limitData.codeid = newValue
            }
            
            console.log('EDIT',this.limitData)
        },
        handlePagination(data) {
            this.params.page = data.page+1;
            this.params.items_count = data.rows;
            this.getList()
        },
        async getList() {
            this.loading = true
            try {
                const res   = await api.getPartBetLimitList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.list = res.data.data;
                    this.totalCount = res.data.totalCount
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
                this.selectedCodeID = null
                this.limitData.gamecode = null
                this.limitData.codeid = ''
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