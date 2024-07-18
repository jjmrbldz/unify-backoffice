<template>
    <div class="flex justify-content-between align-items-center px-4">
        <h3 class="py-4 my-0">{{ $store.getters['languageStore/translate'](this.$route.meta.title) }}</h3>
        <BetSumm v-if="$route.path === '/history/bet'" />
    </div>
    <Divider class="m-0" />
</template>

<script>

</script>