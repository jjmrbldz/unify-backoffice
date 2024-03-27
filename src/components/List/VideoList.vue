<template>
    <DataTable :value="list" scrollable class="mt-4" stripedRows :loading="loading">
        <Column field="id" header="ID" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.id }}</span>
            </template>
        </Column>
        <Column field="title" header="Title" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.title }}</span>
            </template>
        </Column>
        <Column field="status" header="Status" style="min-width: 100px">
            <template #body="{ data }">
                <StatusTag :status="data.status" />
            </template>
        </Column>
        <Column field="media" header="Video" style="min-width: 100px">
            <template #body="{ data }">
                <span>{{ data.media }}</span>
            </template>
        </Column>
        <Column header="Action" style="min-width: 100px">
            <template #body="{ data }">
                <Button icon="mdi mdi-movie-edit" @click="editVideo(data.id)" />
            </template>
        </Column>
        
        <template #empty> <div class="text-center text-danger"> No result found! </div> </template>
        <!-- <template #empty> <div class="text-center text-danger"> {{ this.$store.getters.translate('noResultsFoundLang') }} </div> </template> -->
    </DataTable>
</template>

<script>
import { defineAsyncComponent } from 'vue';

export default {
    data() {
        return {
            loading: false,
            list: [],
        }
    },
    mounted() {
        this.getList()
    },
    methods: {
        editVideo(id) {
            this.$dialog.open(this.$modalComponent.AddEditVideo, {
                props: {
                    header: 'Add/Edit Video',
                    style: {
                        width: '30vw'
                    },
                    breakpoints: {
                        // '960px': '75vw',
                        // '640px': '90vw'
                    },
                    modal: true,
                },
                data: {
                    id       : id,
                    update   : true
                },
                onClose: (options) => {
                    console.log(options);
                    this.getList()
                }
            });
        },
        getList() {
            this.loading = true
            var s = setTimeout(() => {
                this.list = [
                    {
                        id: 1,
                        title: 'Rakrakan ni William',
                        category: 1,
                        status: 1,
                        media: 'https://www.youtube.com/watch?v=53uMyMD0bLg',
                    },
                    {
                        id: 2,
                        title: 'Rakrakan ni William 2',
                        category: 3,
                        status: 0,
                        media: 'https://www.youtube.com/watch?v=53uMyMD0bLg',
                    },
                ]
                this.loading = false
                clearTimeout(s)
            },500)
        },
    }
}
</script>