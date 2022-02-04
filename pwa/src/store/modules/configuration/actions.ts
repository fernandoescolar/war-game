import { Configuration } from '@/game/game/types'
import { RootState } from '@/store/state'
import { ActionTree } from 'vuex'
import { MutationTypes } from './mutations'
import { State } from './state'

export type Actions = {
    SetValue(data: any): void,
    StartNewGame(): void
}

export const actions: ActionTree<State, RootState> = {
    async SetValue({ commit }, data: any) {
        commit(MutationTypes.SetConfiguration, data)
    },
    async StartNewGame({ commit }) {
        commit(MutationTypes.IncrementGames)
    }
}
