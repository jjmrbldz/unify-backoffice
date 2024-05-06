<template>
    <div class="w-full">
        <Dropdown v-model="gameValue" :showClear="!!gameValue" filter :options="list" optionLabel="label" optionValue="value" :placeholder="$store.getters['languageStore/translate']('typeLang')" class="w-full" :disabled="disabled">
            <template #option="slotProps">
                <span>{{ $store.getters['languageStore/translate'](`${slotProps.option.label}`) }}</span>
            </template>
            <template #clearicon="{slotProps, clearCallback}">
                <i class="p-icon p-dropdown-clear-icon mdi mdi-close" @click="customClear(clearCallback)"></i>
            </template>
        </Dropdown>
    </div>
</template>
<script>

export default {
    name: 'ProviderTypeSelect',
    data() {
        return {
            selected: null,
            disabled: true,
            list: [],
        };
    },
    props:{
        modelValue: String,
        gameType: String,
    },
    watch: {
        gameType: {
            handler(newVal, oldVal) {
                console.log(newVal);
                if(newVal === null || newVal === '' || newVal === 'all') {
                    this.disabled = true
                    this.list = []
                    return 'all'
                } else if (newVal === 'sport') {
                    this.disabled = false
                    this.list = [
                        {label: this.$store.getters['languageStore/translate']('All'), value: 'all'},
                        {label: this.$store.getters['languageStore/translate']('Live'), value: 'live'},
                        {label: this.$store.getters['languageStore/translate']('Prematch'), value: 'prematch'},
                    ]
                } else if (newVal === 'live') {
                    this.disabled = false
                    this.list = [
                        {label: this.$store.getters['languageStore/translate']('All'), value: 'all'},
                        {label: this.$store.getters['languageStore/translate']('Evolution'), value: 'evo'},
                        {label: this.$store.getters['languageStore/translate']('Pragmatic'), value: 'pp'},
                    ]
                } else if (newVal === 'slot') {
                    this.disabled = false
                    this.list = [
                        {label: this.$store.getters['languageStore/translate']('All'), value: 'all'},
                        {label: this.$store.getters['languageStore/translate']('Pragmatic'), value: 'pp'},
                    ]
                } else if (newVal === 'minigame') {
                    this.disabled = false
                    this.list = [
                        {label: this.$store.getters['languageStore/translate']('All'), value: 'all'},
                        {label: this.$store.getters['languageStore/translate']('Ava'), value: 'ava'},
                    ]
                }
            }
        }
    },
    computed: {
        gameValue: {
            get() {
                if(this.modelValue === null || this.modelValue === '') {
                    return 'all'
                }  else {
                    return this.modelValue;
                }
            },
           
            set(value) {
                console.log(value)
                this.$emit('update:modelValue', value);
            },
        },
    },
    mounted(){
    },
    methods:{
        customClear(clearCallback) {
            clearCallback();
            this.gameValue = '';
        },
    }
}
</script>
<style>
    
</style>