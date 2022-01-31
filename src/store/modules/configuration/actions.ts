import { Configuration } from '@/game/game/types'
import { RootState } from '@/store/state'
import { ActionTree } from 'vuex'
import { MutationTypes } from './mutations'
import { State } from './state'

export type Actions = {
    SetValue(data: Configuration): void
}

export const actions: ActionTree<State, RootState> = {
    async SetValue({ commit }, data: Configuration) {
        commit(MutationTypes.SetConfiguration, data)
    }
}
