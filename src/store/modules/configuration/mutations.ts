import { MutationTree } from 'vuex'
import { Configuration } from '@/game/game/types'
import { State } from './state'

export enum MutationTypes {
    SetConfiguration = 'SET_SET_CONFIGURATION'
}

export const mutations: MutationTree<State> = {
    [MutationTypes.SetConfiguration](state: State, data: Configuration) {
        state = data
    }
}