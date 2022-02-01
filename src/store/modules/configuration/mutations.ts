import { MutationTree } from 'vuex'
import { State } from './state'

export enum MutationTypes {
    SetConfiguration = 'SET_SET_CONFIGURATION',
    IncrementGames = 'INCREMENT_GAMES',
}

export const mutations: MutationTree<State> = {
    [MutationTypes.SetConfiguration](state: State, data: any) {
        Object.assign(state, data)
    },
    [MutationTypes.IncrementGames](state: State) {
        state.games++
    }
}