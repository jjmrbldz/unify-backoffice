import { api } from "@/axios/api"

const state     = {
    user        : null
}

const mutations = {
    setUser(state, user) {
        state.user = user
    },
}

const actions   = {
    async login(context, data) {
        try {

            const res   = await api.login(data);
            // const ecode = res.data.ecode;
            // const msg   = res.data.message;
            console.log(res);
            
            // if (ecode > 0) {
            //     customToast(ecode, context.getters.translate(msg) ? context.getters.translate(msg) : msg);
            //     context.commit('setLoading',  false);
            // } else {
            //     const userData      = res.data.data;
            //     const request_id    = data.request_id;
            //     const user_type     = data.user_type;
            //     const user          = {
            //         request_id      : request_id,
            //         username        : userData.username,
            //         user_type       : user_type,
            //         login_token     : userData.login_token,
            //         p_parentID      : userData.p_parentID,
            //         t_partnerID     : userData.t_partnerID,
            //         user_id         : userData.id,
            //         path            : userData.path,
            //         tp_parentid     : userData.partnerid,
            //         partnerid       : userData.partnerid,
            //         tp_website      : userData.tp_website,
            //         tp_allow_partner: userData.tp_allow_partner,
            //         tp_site_title   : userData.tp_site_title,
            //         tp_favicon      : userData.tp_favicon,
            //         tp_logo         : userData.tp_logo,
            //     }

            //     context.commit('setUser',  user);
            //     customToast(ecode, context.getters.translate(msg) ? context.getters.translate(msg) : msg);
            //     var s = setTimeout(() => {
            //         router.push('/dashboard');
            //         context.commit('setLoading',  false);
            //         clearTimeout(s)
            //     }, 300);

            //     return user
            // }
            

        } catch (error) {
            console.error('Login failed:', error);
            // commit('setLoading',  false);
            // commit('logout');

            throw error;
        }
    },
    async checkToken(context) {
        if (context.state.login_token) {
            try {
                const data = { 
                    request_id: context.state.request_id, 
                    user_type: context.state.user_type, 
                    user_token: context.state.login_token, 
                }
                
                const response  = await api.checkToken(data);
                console.log(response);
                // if(response.data.ecode === 510){
                //     customToast(response.data.ecode, context.getters.translate(response.data.message) ? context.getters.translate(response.data.message) : response.data.message);
                //     context.commit('logout')
                // }

            } catch(error) {
                console.error(error)
                // context.commit('logout')
                throw error
            }
        }
    },
}

const getters = {
    isLoggedIn: (state) => !!state.login_token,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
