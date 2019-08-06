export const state = () =>({
    userInfo:{
        token:'',
        user:{}
    }
})

export const mutations = {
    storeUserInfo(state,obj){
        state.userInfo = obj
    },
    clearUserInfo(state){
        state.userInfo.token = ''
        state.userInfo.user = {}
    }
}

export const getters = {
    
}

export const actions = {
    commitStoreUserInfo({commit},obj){
        commit('storeUserInfo',obj)
    },
    commitClearUserInfo({commit}){
        commit('clearUserInfo')
    }
}
