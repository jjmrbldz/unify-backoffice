<template>
    <div class="grid">
        <div class="col" :class="{'col-6': !hide}">
            <div class="p-2">
                <div class="field grid" v-if="!subAgent">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Number') }}</label>
                    <InputText v-model="params.id" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Agent Name') }}</label>
                    <InputText v-model="params.tp_name" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('ID') }}</label>
                    <InputText v-model="params.username" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Password') }}</label>
                    <Password v-model="params.password" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" placeholder="••••••" toggleMask :feedback="false" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Level') }}</label>
                    <InputText v-model="params.tp_level" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('API Key') }}</label>
                    <InputText v-model="params.tp_casino_key" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Token') }}</label>
                    <InputText v-model="params.tp_api_token" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Seamless API URL') }}</label>
                    <InputText v-model="params.tp_hostname" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                </div>
                <div class="field grid" v-if="!subAgent">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('White IP') }}</label>
                    <InputText v-model="params.tp_white_ip" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Fee Rate') }}</label>
                    <InputNumber v-model="params.tp_share" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :useGrouping="false" suffix="%" :min="0" :max="100" :minFractionDigits="2" :maxFractionDigits="2" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Lower Agent Count') }}</label>
                    <InputText v-model="params.agentCount" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Lower User Count') }}</label>
                    <InputText v-model="params.userCount" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid" v-if="!subAgent">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Total Holdings') }}</label>
                    <InputNumber v-model="params.realCash" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :useGrouping="true" :minFractionDigits="2" :maxFractionDigits="2" :disabled="true" />
                </div>
                <div class="field grid" v-if="!subAgent">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Registered Date Time') }}</label>
                    <InputText v-model="params.tp_reg_datetime" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
                </div>
                <div class="field grid" v-if="subAgent">
                    <label class="col-3">{{ $store.getters['languageStore/translate']('Status') }}</label>
                    <Dropdown v-model="userStatus" :options="statusOptions" optionLabel="label" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full">
                        <template #value="slotProps">
                            <span  v-if="slotProps.value" class="">{{ $store.getters['languageStore/translate'](`${slotProps.value.label}`) }}</span>
                            <span v-else>
                                {{ slotProps.placeholder }}
                            </span>
                        </template>
                        <template #option="slotProps">
                            <span class="">{{ $store.getters['languageStore/translate'](slotProps.option.label )}}</span>
                        </template>
                    </Dropdown>
                </div>
            </div>
            <div class="flex">
                <div class="mx-auto flex w-6">
                    <Button class="py-3 w-full" :label="$store.getters['languageStore/translate']('SAVE')" @click="submit()" :disabled="buttonDisabled" />
                    <template v-if="subAgent">
                        <Button class="mx-3 py-3 font-bold w-full bg-blue-500 hover:bg-blue-600 border-none" :label="$store.getters['languageStore/translate']('CREDIT PAYMENT')" @click="showAddDeduct('add')" :disabled="buttonDisabled" />
                        <Button class="py-3 font-bold w-full bg-red-500 hover:bg-red-600 border-none" :label=" $store.getters['languageStore/translate']('PAYBACK')" @click="showAddDeduct('deduct')" :disabled="buttonDisabled" />
                    </template>
                </div>
            </div>
        </div>
        <Divider layout="vertical" />
        <div class="pt-0" :class="{col: !hide}">
            <div class="flex justify-content-between">
                <h3 v-if="!hide">{{ $store.getters['languageStore/translate']('gameOfferingListLang') }}</h3>
                <Button class="text-xl" :icon="hide ? 'mdi mdi-open-in-new' : 'mdi mdi-close-circle'" @click="hide = !hide" text rounded />
            </div>
            <CasinoGameList v-if="!hide" />
        </div>
    </div>
</template>

<style lang="scss" scoped>
label {
    margin: 0;
    display: block;
    text-wrap: nowrap;
}
</style>

<script>
import { mapState } from 'vuex';
import { api, TOKEN } from '@/axios/api';
import CasinoGameList from './List/CasinoGameList.vue';

export default {
    provide() {
        return {
            mypage  : true,
            dialogRef: {
                data: {
                    agentID: this.$route.params.subAgent ? this.$route.params.subAgent : this.$store.state.userStore.username,
                    image: true,
                }
            }
        }
    },
    data() {
        return {
            hide    : false,
            buttonDisabled: false,
            loading     : {},
            params      : {},
            subAgent    : null,
            userStatus  : null,
            statusOptions: [
                { label: 'NORMAL', value: 1 },
                { label: 'STOP', value: 0 },
            ]
        }
    },
    mounted() {
        if(this.$route.params.subAgent) {
            this.subAgent = this.$route.params.subAgent
        }
        this.getUserDetails();
        console.log(this.params);
    },
    methods: {
        showAddDeduct(type) {
            this.$dialog.open(this.$modalComponent.AddDeductBalance, {
                props: {
                    header: this.$store.getters['languageStore/translate'](`${type === 'add' ? 'CREDIT PAYMENT' : 'PAYBACK'}`),
                    style: {
                        width: '40vw'
                    },
                    modal: true,
                },
                data: {
                    type: type,
                    balance: this.params.realCash,
                    filter_agentid: this.subAgent,
                },
                onClose: (options) => {
                    this.getUserDetails();
                }
            });
        },
        async submit() {
            try {
                let reqBody = {
                    Authorization   : `Bearer ${TOKEN}`,
                    username        : this.$store.state.userStore.username,
                    token           : this.$store.state.userStore.token,
                    agent_share     : this.params.tp_share >= 0 ? this.params.tp_share : "",
                    agent_email     : this.params.tp_email,
                    agent_name      : this.params.tp_name,
                    agent_nickname  : this.params.tp_nickname,
                    agent_key       : this.params.tp_casino_key,
                    agent_token     : this.params.tp_api_token,
                    agent_host      : this.params.tp_hostname,
                    agent_level     : this.params.tp_level,
                    agent_password  : this.params.password === '' ? "xxxxxx" : this.params.password,
                    agent_status    : this.params.tp_status >= 0 ? `${this.userStatus.value}` : "",
                    agent_white_ip  : this.params.tp_white_ip ? this.params.tp_white_ip : "",
                    filter_agentid  : this.params.username
                }

                const res   = await api.saveUserDetails(reqBody);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }

            } catch(error) {
                console.error(error)
                throw error
            } finally {
                this.getUserDetails()
            }
        },
        async getUserDetails() {
            this.loading    = true
            try {
                const data = { 
                    Authorization   : `Bearer ${TOKEN}`,
                    token           : this.$store.state.userStore.token,
                    username        : this.$store.state.userStore.username, 
                    filter_agentid  : this.subAgent ? this.subAgent : this.$store.state.userStore.username, 
                }
                const res   = await api.agentDetails(data);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data.data);
                if(code === 1) {
                    this.params         = res.data.data
                    this.userStatus     = this.statusOptions.find(item => item.value === this.params.tp_status)
                    this.params.tp_share= this.params.tp_share * 100
                    this.params.password= ''
                    // this.buttonDisabled = true
                } else {
                    
                }

            } catch (error) {
                this.params = {}
                console.error(error);
                throw error;
            } finally {
                // this.buttonDisabled = true
                this.loading    = false
            }
        },
    }
}
</script>