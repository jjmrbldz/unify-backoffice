<template>
    <div class="formgrid grid p-2">
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('ID') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-account"></InputIcon>
                <InputText v-model="params.agent_username" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Password') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-lock z-1"></InputIcon>
                <Password v-model="params.agent_password" class="w-full" inputStyle="padding-left: 2.5rem" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" placeholder="••••••" toggleMask :feedback="false" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Nickname') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-badge-account-horizontal"></InputIcon>
                <InputText v-model="params.agent_nickname" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Parentid') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-account-multiple"></InputIcon>
                <InputText v-model="parentUsername" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Share') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-percent"></InputIcon>
                <InputNumber v-model="params.agent_share" class="w-full" inputStyle="padding-left: 2.5rem" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :useGrouping="false" suffix="%" :min="0" :max="100" :minFractionDigits="2" :maxFractionDigits="2" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Key') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-key"></InputIcon>
                <InputText v-model="params.agent_key" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Token') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-form-textbox-password"></InputIcon>
                <InputText v-model="params.agent_token" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Host') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-web"></InputIcon>
                <InputText v-model="params.agent_host" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </IconField>
        </div>
        <div class="field col-6">
            <label>{{ $store.getters['languageStore/translate']('Agent Level') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-sitemap"></InputIcon>
                <InputText v-model="params.agent_level" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
            </IconField>
        </div>
        <div class="field col-6" v-if="!subAgent">
            <label>{{ $store.getters['languageStore/translate']('Agent Whitelist IP') }}</label>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-ip-network"></InputIcon>
                <InputText v-model="params.agent_white_ip" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
            </IconField>
        </div>
        
    </div>
    <div class="flex">
        <Button class="mx-auto py-3 w-2" label="Save" @click="submit()" />
    </div>
</template>


<script>
import { mapState } from 'vuex';
import { api, TOKEN } from '@/axios/api';
import { v4 as uuidv4 } from 'uuid';

 export default {
    data() {
        return {
            loading     : false,
            params      : {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                tp_grade        : '',
                agent_username  : '',
                agent_password  : '',
                agent_nickname  : '',
                agent_parentid  : '', // id
                agent_share     : '',
                agent_key       : uuidv4(), // uuid
                agent_token     : uuidv4(), // uuid
                agent_host      : '',
                agent_white_ip  : '',
                agent_level     : '',
            },
        }
    },
    mounted() {
        if(this.$route.query) {
            console.log(this.$route.query);
            // this.params = this.$route.query
            console.log(this.params);
        }
    },
    methods: {
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