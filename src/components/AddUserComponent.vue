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
                <InputText v-model="parent_username" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
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
            parent_username:   null,
            params      : {},
        }
    },
    mounted() {
        this.initParams();
    },
    methods: {
        initParams() {
            this.params = {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                tp_grade        : '', // Parent Grade (Agent List Row) -> Route Query
                agent_username  : '',
                agent_password  : '',
                agent_nickname  : '',
                agent_parentid  : '', // Parent ID (Agent List Row) -> Route Query
                agent_share     : null,
                agent_key       : uuidv4(), // uuid
                agent_token     : uuidv4(), // uuid
                agent_host      : '',
                agent_white_ip  : '',
                agent_level     : '', // New Agent Level + 1 -> Route Query
            }
            this.initQuery();
            console.log(this.params);
        },
        initQuery() {
            if(this.$route.query) {
                const { agent_parentid, agent_level, tp_grade, parent_username } = this.$route.query
                this.params.agent_parentid  = agent_parentid
                this.params.agent_level     = parseInt(agent_level) + 1
                this.params.tp_grade        = tp_grade
                this.parent_username        = parent_username
            }
        },
        async submit() {
            try {

                const res   = await api.createAgent(this.params);
                const code  = res.data.status;
                const msg   = res.data.error_code;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.initParams();
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }

            } catch(error) {
                console.error(error)
                throw error
            } finally {
                
            }
        }
    }
 }
</script>