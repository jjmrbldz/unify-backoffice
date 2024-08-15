<template>
    <div class="w-full">
        <InputNumber v-model="selectValue" 
            class="w-full" 
            inputClass="py-2 pr-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" 
            :min="0" :minFractionDigits="0" 
            :maxFractionDigits="0" 
            :disabled="disabled" 
            @focus="(event) => this.$refs.betAmountPanel.toggle(event)"
        />
        <OverlayPanel ref="betAmountPanel">
            <div class="flex align-items-center mb-2">
                <RadioButton v-model="selectValue" inputId="sortByAmount" :value="1000000" />
                <label for="sortByAmount" class="ml-2">1,000,000</label>
            </div>
            <div class="flex align-items-center mb-2">
                <RadioButton v-model="selectValue" inputId="sortByAmount" :value="500000" />
                <label for="sortByAmount" class="ml-2">500,000</label>
            </div>
            <div class="flex align-items-center mb-2">
                <RadioButton v-model="selectValue" inputId="sortByAmount" :value="300000" />
                <label for="sortByAmount" class="ml-2">300,000</label>
            </div>
        </OverlayPanel>
    </div>
</template>
<script>

export default {
    name: 'IsLiveSelect',
    data() {
        return {
            list: [
                // {label: 'All', value: null},
                {label: 'Prematch', value: 0},
                {label: 'Live', value: 1},
            ],
        };
    },
    props:{
        modelValue: '',
        disabled: Boolean
    },
    computed: {
        selectValue: {
            get() {
                if(this.modelValue === null) {
                    console.log(this.modelValue );
                    return null
                } else {
                    return this.modelValue;
                }
            },
            set(value) {
                console.log(value)
                this.$emit('update:modelValue', value);
            },
        },
    },
    methods:{
        customClear(clearCallback) {
            clearCallback();
            this.selectValue = null;
        },
        returnLabel(optVal) {
            const label = this.list.find(item => item.value === optVal)
            return label ? label.label : 'All'
        },
    }
}
</script>
<style>
    
</style>