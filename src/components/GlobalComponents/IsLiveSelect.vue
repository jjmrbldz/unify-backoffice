<template>
    <div class="w-full">
        <Dropdown v-model="selectValue" :showClear="selectValue >= 0 ? true : false" :options="list" optionLabel="label" optionValue="value" :placeholder="$store.getters['languageStore/translate']('Live or Not')" class="w-full" :disabled="disabled">
            <template #value="slotProps">
                <span v-if="slotProps.value === null || slotProps.value === undefined">
                    {{ slotProps.placeholder }}
                </span>
                <div  v-else class="d-flex align-items center" style="gap: 4px;">
                    <span class="">{{ $store.getters['languageStore/translate'](returnLabel(slotProps.value)) }}</span>
                </div>
            </template>
            <template #option="slotProps">
                <div class="d-flex align-items center" style="gap: 4px;">
                    <span class=""> {{ $store.getters['languageStore/translate'](slotProps.option.label) }}</span>
                </div>
            </template>
            <template #clearicon="{slotProps, clearCallback}">
                <i class="p-icon p-dropdown-clear-icon mdi mdi-close" @click="customClear(clearCallback)"></i>
            </template>
        </Dropdown>
    </div>
</template>
<script>

export default {
    name: 'IsLiveSelect',
    data() {
        return {
            list: [
                // {label: 'All', value: null},
                {label: 'Prematch', value: 2},
                {label: 'Live', value: 3},
                {label: 'Multiple Bet', value: 5},
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