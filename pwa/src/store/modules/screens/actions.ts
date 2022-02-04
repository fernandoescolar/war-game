import { RootState } from '@/store/state'
import { ActionTree } from 'vuex'
import { MutationTypes } from './mutations'
import { State } from './state'

export type Actions = {
    ViewStart(): void,
    ViewGame(): void,
    ViewAbout(): void,
    ViewStatistics(): void,
    ViewConfiguration(): void,
    ViewLoose(): void,
    ViewWin(): void
}

export const actions: ActionTree<State, RootState> = {
    ViewStart({ commit }) {
        commit(MutationTypes.ViewStart)
    },
    ViewGame({ commit }) {
        commit(MutationTypes.ViewGame)
    },
    ViewAbout({ commit }) {
        commit(MutationTypes.ViewAbout)
    },
    ViewStatistics({ commit }) {
        commit(MutationTypes.ViewStatistics)
    },
    ViewConfiguration({ commit }) {
        commit(MutationTypes.ViewConfiguration)
    },
    ViewLoose({ commit }) {
        commit(MutationTypes.ViewLoose)
    },
    ViewWin({ commit }) {
        commit(MutationTypes.ViewWin)
    }
}
