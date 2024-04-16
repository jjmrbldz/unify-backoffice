import { createStore } from 'vuex'
import { lightThemePersister } from '@/plugins/lightThemePersister'

const langState = localStorage.getItem('lang')
const translateState = JSON.parse(localStorage.getItem('translate'))


const state     = {
    lang        : langState ? JSON.parse(langState) : 'kr',
    translate   : translateState ? translateState : {},
}

const mutations = {
    setLang(state, lang) {
        state.lang = lang
    },
    setTranslate(state, translate) {
        state.translate = translate
    },
}

const actions   = {
    async setLang({commit, state}, data) {
        try {
            commit('setLang', data)
            const translate = await import(`../../lang/${data}.json`)
            commit('setTranslate', JSON.parse(JSON.stringify(translate.default)));
        } catch (err) {
            console.error(err)
            throw err
        }
    },
    setTranslate({commit}, data) {
        commit('setTranslate', data)
    },
}

const getters = {
    translate: (state) => key => state.translate[key] ? state.translate[key] : key,
}


export default {
    namespaced: true,
    state,
    mutations,
    actions,
    getters
};
