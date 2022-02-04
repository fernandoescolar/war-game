import { RootState } from '@/store/state'
import { Module } from 'vuex'
import { actions } from './actions'
import { getters } from './getters'
import { mutations } from './mutations'
import { state } from './state'
import type { Actions } from './actions'
import type { State } from './state'

const module: Module<State, RootState> = {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}

export { module, Actions, State }