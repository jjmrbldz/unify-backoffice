<template>
    <div class="field">
        <label for="firstname1">Title</label>
        <InputText class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <div class="field">
        <label for="lastname1">Desciption</label>
        <InputText class="text-base text-color surface-overlay p-2 border-1 border-solid surface-border border-round appearance-none outline-none focus:border-primary w-full" />
    </div>
    <hr>
    <Button label="Save" @click="submit('data')" />
</template>

<script>
export default {
    inject: ['dialogRef'],
    data() {
        return {
            id      : this.dialogRef.data ? this.dialogRef.data.id : null,
            update  : this.dialogRef.data ? this.dialogRef.data.update : false,
            params: {
                title   : '',
                desc    : '',
            },
        }
    },
    mounted() {
        console.log(this.update);
    },
    methods: {
        submit(e) {
            console.log(e);
            this.dialogRef.close(e);
        }
    }
}
</script>