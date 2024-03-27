<template>
    <Tag v-if="status === 0" severity="warning" value="Inactive"></Tag>
    <Tag v-else="status === 1" severity="success" value="Active"></Tag>
</template>

<script>
export default {
    props: {
        status: Number
    }
}
</script>