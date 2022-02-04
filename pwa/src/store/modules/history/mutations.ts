import { Log } from '@/game/logs'
import { MutationTree } from 'vuex'
import { State } from './state'

export enum MutationTypes {
    AddLog = 'ADD_LOG',
    AddLogString = 'ADD_LOG_STRING',
    Reset = 'RESET_LOGS'
}

export const mutations: MutationTree<State> = {
    [MutationTypes.AddLog](state: State, data: Log) {
        state.logs.push(data)
    },
    [MutationTypes.AddLogString](state: State, data: string) {
        state.lines.push(data)
    },
    [MutationTypes.Reset](state: State) {
        state.lines = []
        state.logs = []
    }
}