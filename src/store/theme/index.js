import { createStore } from 'vuex'
import { lightThemePersister } from '@/plugins/lightThemePersister'

const lightThemeState = localStorage.getItem('lightTheme')


const state     = {
    lightTheme   : lightThemeState ? JSON.parse(lightThemeState) : false,
}

const mutations = {
    setLightTheme(state, lightTheme) {
        state.lightTheme = lightTheme
    },
}

const actions   = {
    setLightTheme({commit, state}, data) {
        console.log(data);
        commit('setLightTheme', data)
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
};
