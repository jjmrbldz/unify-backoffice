<template>
    <div class="w-full">
        <Dropdown v-model="selectValue" :showClear="!!selectValue" :options="list" optionLabel="label" optionValue="value" :placeholder="$store.getters['languageStore/translate']('Select result')" class="w-full" :disabled="disabled">
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
                // {label: 'All', value: ''},
                {label: 'Opened', value: 'Opened'}, // 대기
                {label: 'Lost', value: 'Lost'}, // 패 
                {label: 'Won', value: 'Won'}, // 승
                {label: 'Draw', value: 'Draw'}, // 무
                {label: 'Canceled', value: 'Canceled'}, // 취소
                {label: 'Cashout', value: 'Cashout'}, // 캐시아웃
                {label: 'Half Won', value: 'Half Won'}, // 하프 승
                {label: 'Half Lost', value: 'Half Lost'}, // 하프 패
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