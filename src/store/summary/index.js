

const state     = {
    betSumm: {
        totalBet: 0,
        totalWinning: 0,
        totalProfitLoss: 0,
        totalPendingBet: 0,
        totalExpectedWinning: 0,
    }
}

const mutations = {
    setBetSumm(state, data) {
        state.betSumm = data
    },
}

const actions   = {
    setBetSumm({commit, state}, data) {
        commit('setBetSumm', data)
    },
}


export default {
    namespaced: true,
    state,
    mutations,
    actions
};
