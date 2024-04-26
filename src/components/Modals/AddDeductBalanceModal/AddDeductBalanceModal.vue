<template>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('Upper Agent Balance') }}</label>
        <template v-if="loading">
            <Skeleton width="100%" height="33px" />
        </template>
        <template v-else>
            <IconField iconPosition="left">
                <InputIcon class="mdi mdi-wallet"></InputIcon>
                <InputNumber v-model="topAgentBalance" class="w-full" :inputStyle="{paddingLeft: '2.5rem'}" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  :min="0" :minFractionDigits="2" :maxFractionDigits="2" :disabled="true" />
            </IconField>
        </template>
        <Transition name="bounce">
            <Message v-if="topAgentBalance !== null && topAgentBalance <= 0" severity="warn">{{ $store.getters['languageStore/translate']("Your upper agent doesn't have enough balance.") }}</Message>
        </Transition>
    </div>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('balanceLang') }}</label>
        <IconField iconPosition="left">
            <InputIcon class="mdi mdi-wallet"></InputIcon>
            <InputNumber v-model="balance" class="w-full" :inputStyle="{paddingLeft: '2.5rem'}" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  :min="0" :minFractionDigits="2" :maxFractionDigits="2" :disabled="true" />
        </IconField>
    </div>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('amountLang') }}</label>
        <IconField iconPosition="left">
            <InputIcon class="mdi mdi-hand-coin"></InputIcon>
            <InputNumber v-model="params.amount" class="w-full" :inputStyle="{paddingLeft: '2.5rem'}" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  :min="0" :minFractionDigits="2" :maxFractionDigits="2" />
        </IconField>
    </div>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('noteLang') }}</label>
        <IconField iconPosition="left">
            <InputIcon class="mdi mdi-note-text" style="top: 15px;"></InputIcon>
            <Textarea v-model="params.note" class="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" rows="3" />
        </IconField>
    </div>
    <Divider />
    <Button class="w-full" :severity="type === 'add' ? 'success' : 'danger'"  :label="$store.getters['languageStore/translate'](`${type === 'add' ? 'addLang' : 'deductLang'}`)" @click="submit()" :disabled="disabled" />
</template>

<style scoped>

.bounce-enter-active {
    animation-name: bounce;
    animation-duration: .5s;
    animation-delay: 0.25s;
}
.bounce-leave-active {
    animation-name: bounce;
    animation-duration: .5s;
    animation-delay: 0.25s;
  /* animation: bounce 0.3s reverse; */
}

@keyframes bounce {
  0% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
  37% {
    transform: translateX(5px);
    timing-function: ease-out;
  }
  55% {
    transform: translateX(-5px);
    timing-function: ease-in;
  }
  73% {
    transform: translateX(4px);
    timing-function: ease-out;
  }
  82% {
    transform: translateX(-4px);
    timing-function: ease-in;
  }
  91% {
    transform: translateX(2px);
    timing-function: ease-out;
  }
  96% {
    transform: translateX(-2px);
    timing-function: ease-in;
  }
  100% {
    transform: translateX(0px);
    timing-function: ease-in;
  }
}

</style>

<script>
import { api, TOKEN } from '@/axios/api';
export default {
    inject: ['dialogRef'],
    data() {
        return {
            loading     : false,
            topAgentBalance: null,
            disabled    : true,
            type        : this.dialogRef.data ? this.dialogRef.data.type : null,
            balance     : this.dialogRef.data ? this.dialogRef.data.balance : null,
            parentUsername     : this.dialogRef.data ? this.dialogRef.data.parentUsername : null,
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : this.dialogRef.data ? this.dialogRef.data.filter_agentid : null,
                amount          : null,
                note            : null,
            },
        }
    },
    watch: {
        'params.amount'(newVal, oldVal) {
            if(this.topAgentBalance > 0 && this.params.note) {
                if(newVal) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            }
        },
        'params.note'(newVal, oldVal) {
            if(this.topAgentBalance > 0 && this.params.amount > 0) {
                if(newVal) {
                    this.disabled = false;
                } else {
                    this.disabled = true;
                }
            }
        }
    },
    mounted() {
        this.getParentDetails();
        console.log(this.update);
    },
    methods: {
        async submit() {
            this.loading = true
            try {
                if(this.topAgentBalance > 0) {
                    if(this.params.amount > 0) {
                        if(this.params.note) {

                            const res   = await api[`${this.type === 'add' ? 'addCash' : 'deductCash'}`](this.params);
                            const code  = res.data.code;
                            const msg   = res.data.message;
                            console.log(res);
            
                            if(code === 1) {
                                this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                                this.dialogRef.close();
                            } else {
                                this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                            }
                        } else {
                            this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Please complete all fields!`))
                        }
                    } else {
                        this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Amount must be greater than 0 (zero)`))
                    }
                } else {
                    this.$GF.customToast(-1, this.$store.getters['languageStore/translate'](`Balance Not Enough!`))
                }
                
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading = false
            }
        },
        async getParentDetails() {
            this.loading    = true
            try {
                const data = { 
                    Authorization   : `Bearer ${TOKEN}`,
                    token           : this.$store.state.userStore.token,
                    username        : this.$store.state.userStore.username, 
                    filter_agentid  : this.$route.query.parent_username ? this.$route.query.parent_username : this.parentUsername, 
                }
                const res   = await api.agentDetails(data);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res.data.data);
                if(code === 1) {
                    this.topAgentBalance         = res.data.data.realCash;
                } else {
                    
                }

            } catch (error) {
                this.topAgentBalance = null
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