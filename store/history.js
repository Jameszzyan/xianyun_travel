export const state = ()=>({
    history:[]
})

export const mutations = {
    storeHistory(state,obj){
        state.history.unshift(obj)
    }
}

export const getters = {
    getHistory(state){
        return state.history
    }
}

export const actions = {
    commitStoreHistory({commit},obj){
        commit('storeHistory',obj)
    }
}