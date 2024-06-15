<template>
    <div class="grid">
        <template v-if="loading">
            <div v-for="key in 3" class="col game-item">
                <Skeleton v-if="image" width="245px" height="120px" />
                <div class="flex align-items-center justify-content-between">
                    <Skeleton class="my-3" width="120px" height="20px" />
                    <Skeleton v-if="isVisible" class="" width="35px" height="21px" />
                </div>
            </div>
        </template>
        <div v-else class="col game-item" v-for="item in list">
            <Card class="w-full overflow-hidden">
                <template v-if="image" #header>
                    <img v-if="providerLogo" alt="Provider Logo" :style="item.status === 0 ? 'filter: grayscale(1);' : ''" :src="providerLogo[item.gameCode] ? providerLogo[item.gameCode] : providerLogo['provider-placeholder']" />
                </template>
                <template #content>
                    <div class="flex align-items-center justify-content-between">
                        <h3 class="title">{{item.casinoName}}</h3>
                        <InputSwitch v-if="isVisible || $route.path === '/settings/vendor' || showToggle" v-model="item.status" :true-value="1" :false-value="0" :checked="item.status" @change="handleStatusChange(item.gameCode, item.status)" />
                    </div>
                </template>
            </Card>
        </div>
    </div>
    <Button v-if="$route.path === '/settings/vendor'" class="mt-3" :label="$store.getters['languageStore/translate']('SAVE')" @click="submit()" :loading="loading" :disabled="disabled"  />
</template>

<style lang="scss" scoped>
    :deep(.p-card-header) {
        min-height: 120px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: var(--surface-100);
        img {
            max-width: 200px;
            max-height: 80px
        }
    }
    :deep(.p-card-body) {
        padding: 1rem;
    }
    .game-item {
        max-width: 270px;
        min-width: 245px;
    }
</style>

<script>
import { api, TOKEN } from '@/axios/api';
// import evo from '@/assets/img/providers/evolution.svg'
// import bti from '@/assets/img/providers/bti.svg'
// import pragmatic from '@/assets/img/providers/pragmatic.png'

import { importAllProviderLogo } from '@/utils/importAllProviderLogo';

export default {
    inject: ['dialogRef', 'mypage', 'subEdit'],
    data() {
        return {
            isVisible: true, 
            image   : this.dialogRef ? this.dialogRef.data.image : true,
            showToggle: this.dialogRef ? this.dialogRef.data.showToggle : true,
            disabled: true,
            loading : false,
            checked : false,
            list    : [],
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : this.dialogRef ? this.dialogRef.data.agentID :this.$store.state.userStore.username,
            },
            updateData: [],
            providerLogo: null,
        }
    },
    watch: {
        updateData: {
            handler(newVal, oldVal) {
                if(newVal) {
                    this.disabled = false
                } else {
                    this.disabled = true
                }
            },
            deep: true
        },
        subEdit(newVal, oldVal) {
            console.log('subEdit?', newVal);
            if(newVal) {
                this.isVisible = true
            } else {
                this.isVisible = false
            }
        }
    },
    async created() {
        const _providerLogo = await importAllProviderLogo();
        console.log(_providerLogo);
        this.providerLogo = _providerLogo;
    },
    mounted() {
        if(this.$route.query.filter_agentid) {
            this.params.filter_agentid = this.$route.query.filter_agentid
        }
        if(this.subEdit) {
            this.isVisible = true
        } else {
            this.isVisible = false
        }
        this.getList();
    },
    methods: {
        async submit() {
            this.loading = true
            console.log('Update Casino Settings Triggered!');
            try {
                let reqBody = {
                    Authorization   : `Bearer ${TOKEN}`,
                    username        : this.$store.state.userStore.username,
                    token           : this.$store.state.userStore.token,
                    filter_agentid  : this.params.filter_agentid,
                    settings        : this.updateData
                }
                const res   = await api.updateCasinoSettings(reqBody);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.loading    = false;
                this.getList();
            }
        },
        updateSwitchArray(id, status) {
            var index = this.updateData.findIndex(function (item) {
                return item.gamecode === id;
            });
            if (index !== -1) {
                this.updateData[index].status = status;
            } else {
                this.updateData.push({ gamecode: id, status: status });
            }
            console.log(this.updateData);
        },
        handleStatusChange(id, status) {
            this.updateSwitchArray(id, status);
        },
        handleCasinoImage(img) {
            console.log(img);
            if(img === 'evo') {
                return evo
            } else if(img === 'bti') {
                return bti
            } else if(img === 'pp') {
                return pragmatic
            }
        },
        async getList() {
            this.loading = true
            try {
                const res   = await api.myCasinoLsit(this.params);
                const code  = res.data.code;
                const msg   = res.data.message;
                console.log(res);

                if(code === 1) {
                    // this.$GF.customToast(code, this.$store.getters['languageStore/translate'](`${msg}`))
                    this.list = res.data.data;

                    // if(this.mypage) {
                    //     this.filterActiveCasino();
                    // }
                } else {
                    this.$GF.customToast(res.data.status, this.$store.getters['languageStore/translate'](`${res.data.error_code}`))
                    this.list = []
                }
            } catch (error) {
                console.error(error)
                throw error
            } finally {
                this.disabled   = true;
                this.loading    = false
                this.updateData = [];
            }
        },
        filterActiveCasino() {
            this.isVisible = false;
            let oldList = this.list
            let newList = [];
            oldList.forEach((item) => {
                console.log(item);
                if(item.status === 1) {
                    newList.push(item);
                }
            });
            console.log(this.list);
            this.list = newList;
        }
    }
}
</script>