<template>
    <div class="formgrid grid mt-4 mb-2">
        <div class="field col-2">
            <label>{{ $store.getters['languageStore/translate']('levelLang') }}</label>
            <Dropdown v-model="params.filter_level_num" :options="levelOptions" optionLabel="label" optionValue="value" placeholder="Search by Level" checkmark :highlightOnSelect="false" class="w-full" showClear @change="handleFilterLevel()" />
        </div>
        <div class="field col-3">
            <label>{{ $store.getters['languageStore/translate']('searchLang') }}</label>
            <InputText type="search" v-model="params.filter_agentid" class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" @keyup.enter="getList()" />
        </div>
    </div>
    <TreeTable v-model:expandedKeys="expandedKeys" :value="list" :indentation="0.425" :resizableColumns="false" columnResizeMode="expand"  :loading="loading">
            <!-- <Column field="id" header="ID" :expander="true"></Column> -->
            <Column :header="$store.getters['languageStore/translate']('Up Agent ID')" :expander="true" style="width: 300px; min-width: 300px;" class="not-col">
                <template #body="slotProps">
                    <span class="">
                        {{ slotProps.node.data.id }}
                    </span>
                    <Tag class="mx-2" :severity="this.$GF.handleLevelColor(slotProps.node.data.tp_grade)" :value="`Level ${slotProps.node.data.tp_grade}`" />
                    <span>{{ slotProps.node.data.parent_username }}</span>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Top Agent Name')">
                <template #body="slotProps">
                    {{ slotProps.node.data.parent_nickname ? slotProps.node.data.parent_nickname : '-' }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Agent ID')">
                <template #body="slotProps">
                    <div class="flex align-items-center">
                        <Badge class="block mr-1" value="" :severity="slotProps.node.data.tp_status ? 'success' : 'warning'"></Badge>
                        <RouterLink class="text-blue-400" :to="{ name: 'agent', params: { subAgent: slotProps.node.data.username }, query: { parent_username: slotProps.node.data.parent_username } }">
                            <span class="" style="word-break: break-all;">{{ slotProps.node.data.username }}</span>
                        </RouterLink>
                    </div>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Agent Name')">
                <template #body="slotProps">
                    {{ slotProps.node.data.tp_nickname }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Current Holding Amount')" style="width: 200px; min-width: 200px; text-align: right;">
                <template #body="slotProps">
                    {{ this.$GF.formatTwoDecimal(slotProps.node.data.realCash) }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Fee Rate')" style="text-align: right;">
                <template #body="slotProps">
                    {{ this.$GF.formatTwoDecimal(slotProps.node.data.tp_share) }}%
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Number of Users')">
                <template #body="slotProps">
                    <span class="mdi mdi-account-multiple mr-2"></span>
                    {{ slotProps.node.data.userCount }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Number of Bettors')">
                <template #body="slotProps">
                    <span class="mdi mdi-poker-chip mr-2"></span>
                    {{ slotProps.node.data.bettorCount ? lotProps.node.data.bettorCount : '-' }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Registered Date Time')">
                <template #body="slotProps">
                    {{ this.$GF.getDateTime(slotProps.node.data.tp_reg_datetime) }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Action')">
                <template #body="slotProps">
                    <Button icon="mdi mdi-pencil" @click="handleOP($event, slotProps.node.data)" rounded outlined/>
                </template>
            </Column>
            <template #empty> <div class="text-center text-danger"> {{ $store.getters['languageStore/translate']('noResultsFoundLang') }} </div> </template>
        </TreeTable>

        <OverlayPanel ref="rowRef" @hide="hideCallBack()">
            <RouterLink class="block mb-1 surface-0 hover:surface-100 text-color-secondary text-base text-left border-round-sm transition-colors transition-duration-200 py-2 px-3"
                :to="
                { name: 'agent', params: { subAgent: rowData.username }, query: { parent_username: rowData.parent_username } }"
            >
                <i class="mdi mdi-account mr-1"></i>
                {{ $store.getters['languageStore/translate']('AGENT DETAILS') }}
            </RouterLink>
            <RouterLink v-if="rowData.tp_grade + 1 <= 3 && rowData.tp_grade + 1 > 0"
                class="block mb-1 surface-0 hover:surface-100 text-left border-round-sm transition-colors transition-duration-200 py-2 px-3"
                :class="this.$GF.handleLevelTextColor(rowData.tp_grade)"
                :to="{path: '/newagent', query: {
                    tp_grade        : rowData.tp_grade, 
                    agent_parentid  : rowData.id,
                    agent_level     : rowData.tp_grade + 1,
                    parent_username: rowData.username,
                    }}"
            >
                <i class="mdi mdi-account-multiple-plus text-color-secondary mr-1"></i>
                {{ `${$store.getters['languageStore/translate']('addLevelLang')} ${rowData.tp_grade + 1}` }}
            </RouterLink>
            <template v-if="$store.state.userStore.tp_level === 'T'">
                <Button class="block mb-1 surface-0 hover:surface-100 text-color-secondary text-base text-left border-round-sm transition-colors transition-duration-200 py-2 px-3" icon="mdi mdi-cog" :label="$store.getters['languageStore/translate']('gameDeliverSettingsLang')" @click="handleGameSettings(rowData.username)" text />
            </template>
            
        </OverlayPanel>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { api, TOKEN } from '@/axios/api';
import {DynamicParentIdSorter, NestedConverter} from '@/utils/Class/agentListSorter'
import { RouterLink } from 'vue-router';

export default {
    data() {
        return {
            rowData : {},
            loading : false,
            list    : [],
            expandedKeys: {},
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : '',
                filter_level_num: null,
            },
            levelOptions    : [
                { label: 'Level 1', value: 1},
                { label: 'Level 2', value: 2},
                { label: 'Level 3', value: 3},
            ]
        }
    },
    watch: {
        'params.filter_agentid'(newVal, oldVal) {
            if(newVal) {

            } else {
                this.params.filter_agentid = this.$store.state.userStore.username
                this.getList()
            }
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        handleFilterLevel() {
            this.params.filter_agentid = ''
            this.getList()
        },
        handleGameSettings(agentID) {
            const CasinoGameList = defineAsyncComponent(() => import('@/components/List/CasinoGameList.vue'))
            this.$dialog.open(CasinoGameList, {
                props: {
                    header: this.$store.getters['languageStore/translate']('gameDeliverSettingsLang'),
                    style: {
                        width: '40vw'
                    },
                    modal: true,
                },
                data: {
                    agentID: agentID,
                    image: true,
                },
                onClose: (options) => {
                    this.getList()
                }
            });
        },
        hideCallBack() {
            this.rowData = {};
        },
        handleOP($event, data) {
            this.rowData = data;
            this.$refs.rowRef.toggle($event);
        },
        collectKeys(obj, result) {
            if (!obj || typeof obj !== 'object') return;
            if (obj.hasOwnProperty('key')) {
                result[obj.key] = true;
            }
            if (Array.isArray(obj)) {
                obj.forEach(item => this.collectKeys(item, result));
            } else {
                Object.values(obj).forEach(val => this.collectKeys(val, result));
            }
        },
        async getList() {
            this.loading = true
            this.list = []
            try {

                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                const res   = await api.agentList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {

                    const sorter = new DynamicParentIdSorter(res.data.data);
                    const sortedData = sorter.sortData();

                    // const rawData = sortedData;
                    const rawData = res.data.data;
                    const getParentDeep = (arr, targetId) => arr.find(({ id }) => id === targetId)
                        ?? arr.flatMap(({ children }) => getParentDeep(children, targetId))
                        .filter(e => e)
                        .at(0);
                    
                    const result2 = rawData
                        .sort(({ tp_parentid: a }, { tp_parentid: b }) => a - b)
                        .reduce((acc, { id, tp_parentid, username, tp_casino_key, tp_api_token, tp_hostname, tp_balance, tp_email, tp_grade, tp_name, tp_nickname, tp_phone, tp_last_login, tp_reg_datetime, tp_reg_ip, tp_last_ip, tp_status, tp_memo, tp_share, tp_level, tp_white_ip, parent_username, realCash, userCount, path, parent_nickname }) => {
                            let data = { id, tp_parentid, username, tp_casino_key, tp_api_token, tp_hostname, tp_balance, tp_email, tp_grade, tp_name, tp_nickname, tp_phone, tp_last_login, tp_reg_datetime, tp_reg_ip, tp_last_ip, tp_status, tp_memo, tp_share, tp_level, tp_white_ip, parent_username, realCash, userCount, path, parent_nickname}
                            const obj = { key : id,id, data, children: [] };
                            const parentObj = getParentDeep(acc, tp_parentid);
                            if (parentObj){
                                obj.key = parentObj.key + "-" + obj.id;
                                parentObj.children.push(obj);
                            }
                            else{
                                acc.push(obj);
                            }
                        return acc;
                    },[]);

                    this.list = result2;

                    this.list.forEach(obj => this.collectKeys(obj, this.expandedKeys))
                    console.log('Converted', this.list);
                    
                } else {
                    this.list = []
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                this.list = []
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
    }
}
</script>