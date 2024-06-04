<template>
    <div class="flex flex-column align-items-center justify-content-center" style="min-height: 350px;">
        <ProgressSpinner v-if="loading && !link" />
        <iframe v-else :src="link" width="100%" height="350px" frameborder="0"></iframe>
    </div>
</template>

<script>
import { api, TOKEN } from '@/axios/api';

export default {
    props: {
        agentID: String,
        gameID: String,
        txID: String
    },
    data() {
        return {
            link: null,
            loading: true,
            params: {
                Authorization   : `Bearer ${TOKEN}`,
                username        : this.$store.state.userStore.username,
                token           : this.$store.state.userStore.token,
                filter_agentid  : this.agentID,
                filter_game_id  : this.gameID,
                filter_txid     : this.txID,
                page            : 1,
                items_count     : 1,
            },
        }
    },
    mounted() {
        this.getResultLink()
    },
    methods: {
        async getResultLink() {
            try {
                const res = await api.getResultLink(this.params)
                const code  = res.data.error;
                const msg   = res.data.description;
                console.log(res.data);

                if(code == 0) {
                    this.$GF.customToast(1, msg)
                    this.link = res.data.url
                } else {
                    this.link = null
                    this.$GF.customToast(res.data.error, msg)
                }
                
            } catch (e) {
                this.link = null
                console.error(e)
                this.$GF.customToast(res.data.error, this.$store.getters['languageStore/translate'](`${res.data.description}`))
            } finally {
                this.loading = false
            }
        },
    }
}
</script>