import { api, TOKEN } from "@/axios/api"
import GF from "@/utils/GlobalFunctions"
import store from '@/store/index'
import router from "@/router"

const userState = JSON.parse(localStorage.getItem('user'))

const state     = {
    user_id     : userState ? userState.user_id : null,
    username    : userState ? userState.username : null,
    token       : userState ? userState.token : null,
    realCash    : 0,
}

const mutations = {
    setUser(state, user) {
        state.user_id   = user.user_id
        state.username  = user.username
        state.token     = user.token
    },
    setAgentDetails(state, user) {
        state.realCash   = user.realCash
    },
    logout(state) {
        state.user_id   = null
        state.username  = null
        state.token     = null
        router.push('/login')
    },
}

const actions   = {
    async login(context, data) {
        try {

            const res   = await api.login(data);
            const code  = res.data.code;
            const msg   = res.data.message;
            console.log(res)
            if(code === 1) {
                context.commit('setUser', res.data.data)
                GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                router.push('/')
            } else {
                context.commit('logout')
                GF.customToast(code, store.getters['languageStore/translate'](`${res.data.error_code}`))
            }

        } catch (error) {
            context.commit('logout')
            console.error('Login failed:', error);
            throw error;
        }
    },
    async checkToken(context) {
        if (context.state.token) {
            try {
                const data = { 
                    Authorization: `Bearer ${TOKEN}`,
                    token: context.state.token,
                    username: context.state.username, 
                }
                const res  = await api.checkToken(data);
                const code  = res.data.code;
                const msg   = res.data.message;

                if(code === 1) {
                    await context.dispatch('agentDetails')
                    return true
                    // GF.customToast(code, store.getters['languageStore/translate'](`${msg}`))
                } else {
                    context.commit('logout')
                    GF.customToast(code, store.getters['languageStore/translate'](`${res.data.error_code}`))
                    return false
                }

            } catch(error) {
                console.error(error)
                context.commit('logout')
                return false
            }
        }
    },
    async agentDetails(context) {
        try {
            const data = { 
                Authorization   : `Bearer ${TOKEN}`,
                token           : context.state.token,
                username        : context.state.username, 
                filter_agentid  : context.state.username, 
            }
            const res   = await api.agentDetails(data);
            const code  = res.data.code;
            const msg   = res.data.message;
            console.log(res);

            if(code === 1) {
                context.commit('setAgentDetails', res.data.data)
            } else {
                
            }

        } catch (error) {
            console.error(error);
            throw error;
        }
    },
}

const getters = {
    isLoggedIn: (state) => !!state.token,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
