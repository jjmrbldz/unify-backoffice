<template>
    <Button v-if="!showAdd" severity="success" :label="$store.getters['languageStore/translate'](`Add Limit`)" @click="showAdd = true" />
    <Panel v-else header="Add Bet Limit">
        <template #icons>
            <Button icon="mdi mdi-close" text rounded @click="handleAddBetLimitClose" />
        </template>
        <div class="field">
            <label for="">{{ $store.getters['languageStore/translate'](`Code`) }}</label>
            <InputText class="w-full" v-model="limitData.codeid" placeholder="Code" />
        </div>
        <Divider />
        <div class="formgrid grid" v-for="(item, index) in limitData.settings" :key="index">
            <div class="field col">
                <label for="">{{ $store.getters['languageStore/translate'](`Title`) }}</label>
                <InputText class="w-full" v-model="item.title" placeholder="Title" />
            </div>
            <div class="field col">
                <label for="">{{ $store.getters['languageStore/translate'](`MIN`) }}</label>
                <InputNumber class="w-full" v-model="item.min_bet" placeholder="Minimum bet" />
            </div>
            <div class="field col">
                <label for="">{{ $store.getters['languageStore/translate'](`MAX`) }}</label>
                <InputNumber class="w-full" v-model="item.max_bet" placeholder="Maximum bet" />
            </div>
            <div class="field col-1">
                <label for=""> &nbsp; </label>
                <div class="w-full" style="line-height: 1;">
                    <!-- <span class="block">
                        <span class="mdi mdi-plus-circle flex text-green-600 relative overflow-hidden w-2rem" style="font-size: 30px;" v-ripple></span>
                    </span> -->
                    <Button v-if="index === limitData.settings.length - 1" class="p-0 w-2rem h-2rem mr-1" severity="success" icon="mdi mdi-plus" rounded style="font-size: 20px; line-height: 1;" :pt="{icon: {style: {display: 'flex'}}}" @click="handleLimitAddRow" />
                    <Button v-if="index > 0" class="p-0 w-2rem h-2rem" severity="danger" icon="mdi mdi-minus" rounded style="font-size: 20px; line-height: 1;" :pt="{icon: {style: {display: 'flex'}}}" @click="handleLimitDeleteRow(index)" />
                </div>
            </div>
        </div>
        <Button severity="info" :label="$store.getters['languageStore/translate'](`Submit`)" @click="addBetLimit" />
    </Panel>
    <DataTable :value="list" class="mt-4" rowGroupMode="rowspan" groupRowsBy="codeId" editMode="cell" @cell-edit-init="onCellEditInit" @cell-edit-complete="onCellEditComplete" :loading="loading">
        <Column field="title" :header="this.$store.getters['languageStore/translate'](`Type`)" style="background-color: var(--surface-100);">
            <template #body="{ data }">
                <span>{{ data.title }}</span>
            </template>
            <!-- <template #editor="{ data, field, index }">
                <InputText class="w-full" v-model="list[index][field]" />
            </template> -->
        </Column>
        <Column field="min_bet" :header="this.$store.getters['languageStore/translate'](`MIN`)" style="">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.min_bet) }}</span>
            </template>
            <template #editor="{ data, field, index }">
                <InputNumber class="w-full" v-model="list[index][field]" />
            </template>
        </Column>
        <Column field="max_bet" :header="this.$store.getters['languageStore/translate'](`MAX`)" style="">
            <template #body="{ data }">
                <span>{{ this.$GF.formatNumComma(data.max_bet) }}</span>
            </template>
            <template #editor="{ data, field, index }">
                <InputNumber class="w-full" v-model="list[index][field]" />
            </template>
        </Column>
        <Column field="codeId" :header="this.$store.getters['languageStore/translate'](`Code`)" style="text-align: center;">
            <template #body="{ data }">
                <span>{{ data.codeId }}</span>
            </template>
        </Column>
        <Column field="codeId" :header="this.$store.getters['languageStore/translate'](`Action`)">
            <template #body="{ data }">
                <Button v-if="editingCodeId === data.codeId" :label="$store.getters['languageStore/translate']('Save')" @click="handleSaveBetLimit(data.codeId)" />
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
                token           : this.$store.state.userStore.token,
                page            : 1,
                items_count     : 9999
                // filter_agentid  : this.dialogRef ? this.dialogRef.data.agentID :this.$store.state.userStore.username,
            },
            limitData: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                codeid          : '',
                gamecode        : this.gameCode,
                settings: [
                    {
                        title: '',
                        min_bet: 0,
                        max_bet: 0,
                    },
                ],
            },
            updateSettings: [],
            showAdd: false,
            editingCodeId: null,
            totalCount: null,
        }
    },
    watch: {
        'limitData.settings': {
            handler(newVal, oldVal) {

                console.log('LIMIT SETTINGS:', newVal);
            },
            deep: true
        },
        editingCodeId: {
            handler(newVal, oldVal) {
                console.log(newVal, oldVal)
                if(oldVal && newVal !== oldVal) {
                    this.updateSettings = []
                    console.log('Reset Update Settings', this.updateSettings)
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
        async handleSaveBetLimit(codeId) {
            try {
                this.limitData.codeid = codeId
                this.limitData.gamecode = this.gameCode

                let _newUpdateSettings = []
                this.updateSettings.map((item) => {
                    if(item) {
                        _newUpdateSettings.push(item)
                    }
                })
                this.limitData.settings = _newUpdateSettings

                console.log(this.limitData)
                const res   = await api.insertUpdateBetLimit(this.limitData);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.showAdd = false
                    this.getList()
                    this.limitData.codeid = ''
                    this.limitData.settings = [
                        {
                            title: '',
                            min_bet: 0,
                            max_bet: 0,
                        },
                    ]
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        onCellEditInit(event) {
            console.log(event)
            const { data } = event
            this.editingCodeId = data.codeId
        },
        onCellEditComplete(event) {
            console.log(event)
            let { data, newValue, field, newData, index, value } = event;
            const {title, min_bet, max_bet, gameCode, codeId} = data

            if(newValue !== value) {
                this.updateSettings[index] = {
                    title: title,
                    min_bet: min_bet,
                    max_bet: max_bet,
                }
            }
            
            console.log('EDIT',this.updateSettings)
        },
        handleAddBetLimitClose() {
            this.showAdd = false
            this.limitData.codeid = ''
            this.limitData.settings = [
                {
                    title: '',
                    min_bet: 0,
                    max_bet: 0,
                },
            ]
        },
        async addBetLimit() {
            console.log(this.limitData)

            try {
                this.limitData.gamecode = this.gameCode
                const res   = await api.insertUpdateBetLimit(this.limitData);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.showAdd = false
                    this.getList()
                    this.limitData.codeid = ''
                    this.limitData.settings = [
                        {
                            title: '',
                            min_bet: 0,
                            max_bet: 0,
                        },
                    ]
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                console.error(error)
                throw error
            }
        },
        handleLimitDeleteRow(index) {
            this.limitData.settings.splice(index, 1)
        },
        handleLimitAddRow() {
            this.limitData.settings.push({
                title: '',
                min_bet: 0,
                max_bet: 0,
            })
        },
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