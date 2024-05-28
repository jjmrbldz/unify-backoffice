<template>
    <span>{{ handleProviderID() }}</span>
</template>

<script>
import { mapState } from 'vuex';

export default {
    props: {
        id: String
    },
    computed: {
        ...mapState('userStore', ['gameList'])
    },
    methods: {
        handleProviderID() {
            for (const item of this.gameList) {
                if(item.gameCode === this.id) {
                    return item.casinoName
                }
            }
        }
    }
}
</script>