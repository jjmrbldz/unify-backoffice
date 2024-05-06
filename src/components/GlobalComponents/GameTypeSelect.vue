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
    name: 'GameTypeSelect',
    data() {
        return {
            selected: null,
            list: [
                {label: this.$store.getters['languageStore/translate']('All'), value: 'all'},
                {label: this.$store.getters['languageStore/translate']('Sports [BTI]'), value: 'sport'},
                {label: this.$store.getters['languageStore/translate']('Casino'), value: 'live'},
                {label: this.$store.getters['languageStore/translate']('Slot'), value: 'slot'},
                {label: this.$store.getters['languageStore/translate']('Minigame'), value: 'minigame'},
            ],
        };
    },
    props:{
        modelValue: String,
        disabled: Boolean
    },
    computed: {
        gameValue: {
            get() {
                if(this.modelValue === null) {
                    return 'all'
                } else {
                    return this.modelValue;
                }
            },
            set(value) {
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