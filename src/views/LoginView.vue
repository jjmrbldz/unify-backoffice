<template>
    <div class="min-h-screen min-w-screen flex align-items-center justify-content-center flex-column">
        <Card class="w-3 h-auto">
            <template #header>
                <div class="logo max-w-18rem mx-auto mt-4">
                    <!-- <img ref="logo" class="w-full" alt="user header" src="../assets/img/rg-logo-hr1.png" /> -->
                    <span class="logo-placeholder ml-3 text-center">LOGO</span>
                </div>
            </template>
            <template #title><div class="font-bold text-center">Administrator Login</div></template>
            <template #content>
                <div class="mt-4">
                    <div class="flex flex-column gap-2 mb-3">
                        <label for="username" class="text-500 font-medium">Username</label>
                        <IconField iconPosition="left">
                            <InputIcon>
                                <i class="pi pi-user " style="left: 14px;" />
                            </InputIcon>
                            <InputText v-model="params.username" class="w-full pl-6 py-3" placeholder="Enter your username" @keyup.enter="login()" />
                        </IconField>
                    </div>
                    <div class="flex flex-column gap-2 mb-5">
                        <label for="username" class="text-500 font-medium">Password</label>
                        <IconField iconPosition="left">
                            <InputIcon class="left-2 z-1">
                                <i class="pi pi-lock " style="left: 14px;" />
                            </InputIcon>
                            <Password v-model="params.password" class="w-full " inputClass="w-full pl-6 py-3" placeholder="Enter your password" :feedback="false" toggleMask  @keyup.enter="login()"/>
                        </IconField>
                    </div>
                    <Button label="Login" class="w-full p-3" @click="login()" />
                </div>
            </template>
        </Card>
    </div>
</template>

<script>
import VanillaTilt from 'vanilla-tilt'

export default {
    data() {
        return {
            params: {
                Authorization: 'Bearer hr0|5StV10{£&4I>5dEw7]X$]hIq>AKMr0@y)]:£XQaf1cxSUz',
                username: null,
                password: null,
                device  : navigator.userAgent,
            }
        }
    },
    mounted() {
        VanillaTilt.init(this.$refs.logo, {
            max: 25,
            speed: 1000,
            glare: true,
            'max-glare': 0.5
        })
    },
    methods: {
        async login() {
            try {
                if(this.params.username && this.params.password) {
                    const ret  = await this.$store.dispatch('userStore/login', this.params);
                } else {
                    this.$GF.customToast(0, this.$store.getters['languageStore/translate']('Please complete all fields'))
                }
            } catch(error) {
                console.error(error)
                throw error
            }
            // try {
            //     if (this.user_type === '' || this.username === '' || this.password === '') {
            //         customToast(1, this.$store.getters.translate('Username/Password is required!'))
            //     } else {
            //         const data = { request_id: this.username, user_account: this.username, user_password: this.password, user_type: this.user_type, user_device: navigator.userAgent };
            //         if (this.$store.state.loading === false) {
            //             const ret  = await this.$store.dispatch('login', data);
            //             this.$store.dispatch('setLoading', true)
            //             if (ret) {
            //                 this.socket.connect()
            //             }
            //         } else {
            //             customToast(-1, this.$store.getters.translate('Please Wait...'));
            //         }
            //     }
            // } catch (error) {
            //     console.error('Login failed:', error);
            //     this.$store.dispatch('setLoading', false)
            // }
        }
    },
    components: {
    }
}
</script>