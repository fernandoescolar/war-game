import { Log } from '@/game/logs'
import { RootState } from '@/store/state'
import { ActionTree } from 'vuex'
import { MutationTypes } from './mutations'
import { State } from './state'

export type Actions = {
    AddLog(data: Log): void,
    AddLogString(data: string): void,
    Reset(): void
}

export const actions: ActionTree<State, RootState> = {
    AddLog({ commit }, data: Log) {
        commit(MutationTypes.AddLog, data)
    },
    AddLogString({ commit }, data: string) {
        commit(MutationTypes.AddLogString, data)
    },
    Reset({ commit }) {
        commit(MutationTypes.Reset)
    }
}
