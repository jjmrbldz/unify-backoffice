<template>
    <div class="p-2">
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Number') }}</label>
            <InputText v-model="params.id" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Agent Name') }}</label>
            <InputText v-model="params.tp_name" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('ID') }}</label>
            <InputText v-model="params.username" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Password') }}</label>
            <Password v-model="params.password" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" placeholder="••••••" toggleMask :feedback="false" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Level') }}</label>
            <InputText v-model="params.tp_level" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('API Key') }}</label>
            <InputText v-model="params.tp_casino_key" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Token') }}</label>
            <InputText v-model="params.tp_api_token" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Seamless API URL') }}</label>
            <InputText v-model="params.tp_hostname" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('White IP') }}</label>
            <InputText v-model="params.tp_white_ip" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Fee Rate') }}</label>
            <InputNumber v-model="params.tp_share" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :useGrouping="false" suffix="%" :min="0" :max="100" :maxFractionDigits="2" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Lower User Count') }}</label>
            <InputText v-model="params.userCount" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Lower Agent Count') }}</label>
            <InputText v-model="params.agentCount" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Total Holdings') }}</label>
            <InputNumber v-model="params.realCash" class="col p-0" inputClass="p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :useGrouping="true" :maxFractionDigits="2" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Registered Date Time') }}</label>
            <InputText v-model="params.tp_reg_datetime" class="col p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" :disabled="true" />
        </div>
        <div class="field grid">
            <label class="col-2">{{ $store.getters['languageStore/translate']('Status') }}</label>
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
        <Button class="mx-auto py-3 w-2" label="Save" @click="submit()" />
    </div>
</template>

<style lang="scss" scoped>
label {
    margin: 0;
}
</style>

<script>
import { mapState } from 'vuex';
import { api, TOKEN } from '@/axios/api';
 export default {
    data() {
        return {
            params      : {},
            isSubAgent  : false,
            userStatus  : null,
            statusOptions: [
                { label: 'NORMAL', value:1 },
                { label: 'STOP', value:0 },
            ]
        }
    },
    computed: {
        ...mapState('userStore', ['userDetails'])
    },
    watch: {
        userDetails(newVal, oldVal) {
            if(newVal && !this.isSubAgent) {
                var s = setTimeout(() => {
                    this.params         = newVal
                    this.userStatus     = this.statusOptions.find(item => item.value === this.params.tp_status)
                    this.params.tp_share= parseFloat(this.params.tp_share)
                    this.params.password= ''
                    clearTimeout(s)
                }, 300)
            }
        },
        '$route'(to, from) {
            if(to.query) {
                this.isSubAgent = true
            }
        }
    },
    mounted() {
        if(this.userDetails && !this.isSubAgent) {
            this.params         = this.userDetails
            this.userStatus     = this.statusOptions.find(item => item.value === this.params.tp_status)
            this.params.tp_share= parseFloat(this.params.tp_share * 100)
            this.params.password= ''
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
            }
        }
    }
 }
</script>