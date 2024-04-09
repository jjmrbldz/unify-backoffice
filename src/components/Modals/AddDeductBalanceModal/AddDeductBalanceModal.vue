<template>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('balanceLang') }}</label>
        <IconField iconPosition="left">
            <InputIcon class="mdi mdi-wallet"></InputIcon>
            <InputNumber v-model="balance" class="w-full" inputStyle="padding-left: 2.5rem" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  :min="0" :minFractionDigits="2" :maxFractionDigits="2" :disabled="true" />
        </IconField>
    </div>
    <div class="field">
        <label for="firstname1">{{ $store.getters['languageStore/translate']('amountLang') }}</label>
        <IconField iconPosition="left">
            <InputIcon class="mdi mdi-hand-coin"></InputIcon>
            <InputNumber v-model="params.amount" class="w-full" inputStyle="padding-left: 2.5rem" inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full"  :min="0" :minFractionDigits="2" :maxFractionDigits="2" />
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

<script>
import { api, TOKEN } from '@/axios/api';
export default {
    inject: ['dialogRef'],
    data() {
        return {
            disabled    : true,
            type        : this.dialogRef.data ? this.dialogRef.data.type : null,
            balance     : this.dialogRef.data ? this.dialogRef.data.balance : null,
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
        'params.note'(newVal, oldVal) {
            if(newVal) {
                this.disabled = false;
            } else {
                this.disabled = true;
            }
        }
    },
    mounted() {
        console.log(this.update);
    },
    methods: {
        async submit() {
            this.loading = true
            try {
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