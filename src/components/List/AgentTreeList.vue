<template>
    <div class="formgrid grid mt-4 mb-2">
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
                    <RouterLink class="text-blue-400" :to="slotProps.node.data.parent_username === $store.state.userStore.username ? { path: '/mypage' } : { name: 'agent', params: { subAgent: slotProps.node.data.parent_username } }">
                        <span>{{ slotProps.node.data.parent_username }}</span>
                    </RouterLink>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Agent ID')">
                <template #body="slotProps">
                    <div class="flex align-items-center">
                        <Badge class="block mr-1" value="" :severity="slotProps.node.data.tp_status ? 'warning' : 'success'"></Badge>
                        <RouterLink class="text-blue-400" :to="slotProps.node.data.username === $store.state.userStore.username ? { path: '/mypage' } : { name: 'agent', params: { subAgent: slotProps.node.data.username } }">
                            <span class="" style="word-break: break-all;">{{ slotProps.node.data.username }}</span>
                        </RouterLink>
                    </div>
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Current Holding Amount')">
                <template #body="slotProps">
                    {{ this.$GF.formatTwoDecimal(slotProps.node.data.realCash) }}
                </template>
            </Column>
            <Column :header="$store.getters['languageStore/translate']('Fee Rate')">
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
            <RouterLink class="block mb-1 surface-0 hover:surface-100 text-color-secondary text-base text-left border-round-sm transition-colors transition-duration-200 py-2 px-3" :to="
                rowData.username === $store.state.userStore.username ? 
                { path: '/mypage' } : 
                { name: 'agent', params: { subAgent: rowData.username } }"
            >
                <i class="mdi mdi-account mr-1"></i>
                {{ rowData.username === $store.state.userStore.username ? 
                    $store.getters['languageStore/translate']('myPageLang') : 
                    $store.getters['languageStore/translate']('AGENT DETAILS')
                }}
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
                <i class="mdi mdi-account-multiple-plus text-color-secondary"></i>
                {{ `${$store.getters['languageStore/translate']('addLevelLang')} ${rowData.tp_grade + 1}` }}
            </RouterLink>
            <Button class="block mb-1 surface-0 hover:surface-100 text-color-secondary text-base text-left border-round-sm transition-colors transition-duration-200 py-2 px-3" icon="mdi mdi-cog" :label="$store.getters['languageStore/translate']('Game Settings')" text />
            
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
            }
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
            try {

                this.params.filter_agentid = this.params.filter_agentid ? this.params.filter_agentid : this.$store.state.userStore.username

                const res   = await api.agentList(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))

                    const sorter = new DynamicParentIdSorter(res.data.data);
                    const sortedData = sorter.sortData();

                    // console.log('Converted:', sortedData);
                    // let arr = [];
                    // for(var item of sortedData) {
                    //     arr.push(
                    //         {
                    //             id: item.id,
                    //             tp_parentid: item.tp_parentid,
                    //             path: item.path
                    //         }
                    //     )
                    // }
                    // console.log('IDs: ',arr);
                    // const converter = new NestedConverter(sortedData);
                    // const nestedData = converter.getNestedData();
                    
                    // this.list = nestedData;

                    const rawData = sortedData;
                    const getParentDeep = (arr, targetId) => arr.find(({ id }) => id === targetId)
                        ?? arr.flatMap(({ children }) => getParentDeep(children, targetId))
                        .filter(e => e)
                        .at(0);
                    
                    const result2 = rawData
                        .sort(({ tp_parentid: a }, { tp_parentid: b }) => a - b)
                        .reduce((acc, { id, tp_parentid, username, tp_casino_key, tp_api_token, tp_hostname, tp_balance, tp_email, tp_grade, tp_name, tp_nickname, tp_phone, tp_last_login, tp_reg_datetime, tp_reg_ip, tp_last_ip, tp_status, tp_memo, tp_share, tp_level, tp_white_ip, parent_username, realCash, userCount, path, }) => {
                            let data = { id, tp_parentid, username, tp_casino_key, tp_api_token, tp_hostname, tp_balance, tp_email, tp_grade, tp_name, tp_nickname, tp_phone, tp_last_login, tp_reg_datetime, tp_reg_ip, tp_last_ip, tp_status, tp_memo, tp_share, tp_level, tp_white_ip, parent_username, realCash, userCount, path }
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
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
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