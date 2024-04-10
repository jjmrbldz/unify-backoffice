import { api, TOKEN } from "@/axios/api"
import GF from "@/utils/GlobalFunctions"
import store from '@/store/index'
import router from "@/router"

const userState = JSON.parse(localStorage.getItem('user'))

const state     = {
    user_id     : userState ? userState.user_id : null,
    username    : userState ? userState.username : null,
    token       : userState ? userState.token : null,
    tp_level    : userState ? userState.tp_level : null,
    tp_grade    : null,
    realCash    : null,
    glblLoading : false,
    currentDateTime: new Date(),
    record      : null,
    userDetails : {},
}

const mutations = {
    setRecord(state, data) {
        state.record   = data
    },
    setLoading(state, bool) {
        state.glblLoading   = bool
    },
    setUser(state, user) {
        state.user_id   = user.user_id
        state.username  = user.username
        state.token     = user.token
        state.tp_grade  = user.tp_grade
    },
    setAgentDetails(state, user) {
        state.realCash   = user.realCash
        state.userDetails= user
        state.tp_level  = user.tp_level
    },
    logout(state) {
        state.user_id   = null
        state.username  = null
        state.token     = null
        state.tp_level  = null
        router.push('/login')
        setTimeout(()=> {
            router.go();
        }, 100);
    },
}

const actions   = {
    async login(context, data) {
        context.commit('setLoading', true);
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
                // context.commit('logout')
                GF.customToast(code, store.getters['languageStore/translate'](`${res.data.error_code}`))
            }

        } catch (error) {
            // context.commit('logout')
            console.error('Login failed:', error);
            throw error;
        } finally {
            context.commit('setLoading', false);
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
        context.commit('setLoading', true);
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

            if(code === 1) {
                context.commit('setAgentDetails', res.data.data)
                return res.data.data
            } else {
                
            }

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            context.commit('setLoading', false);
        }
    },
    async myRevenue(context) {
        context.commit('setLoading', true);
        try {
            const data = { 
                Authorization   : `Bearer ${TOKEN}`,
                token           : context.state.token,
                username        : context.state.username, 
                filter_agentid  : context.state.username, 
                filter_startdate: `${GF.getDateTime(context.state.currentDateTime, 'date')} 00:00:00`, 
                filter_enddate  : `${GF.getDateTime(context.state.currentDateTime, 'date')} 23:59:59`, 
            }
            const res   = await api.myRevenue(data);
            const code  = res.data.code;
            const msg   = res.data.message;

            if(code === 1) {
                context.commit('setRecord', res.data.data[0])
            } else {
                
            }

        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            context.commit('setLoading', false);
        }
    },
}

const getters = {
    isLoggedIn: (state) => !!state.token,
    isLoading: (state) => state.glblLoading,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
