import { MutationTree } from 'vuex'
import { State } from './state'

function hideAll(state: State) {
    state.start = false
    state.game = false
    state.about = false
    state.statistics = false
    state.configuration = false
    state.loose = false
    state.win = false
}

export enum MutationTypes {
    ViewStart = 'VIEW_START',
    ViewGame = 'VIEW_GAME',
    ViewAbout = 'VIEW_ABOUT',
    ViewStatistics = 'VIEW_STATISTICS',
    ViewConfiguration = 'VIEW_CONFIGURATION',
    ViewLoose = 'VIEW_LOOSE',
    ViewWin = 'VIEW_WIN'
}

export const mutations: MutationTree<State> = {
    [MutationTypes.ViewStart](state: State) {
        hideAll(state)
        state.start = true
    },
    [MutationTypes.ViewGame](state: State) {
        hideAll(state)
        state.game = true
    },
    [MutationTypes.ViewAbout](state: State) {
        hideAll(state)
        state.about = true
    },
    [MutationTypes.ViewStatistics](state: State) {
        hideAll(state)
        state.statistics = true
    },
    [MutationTypes.ViewConfiguration](state: State) {
        hideAll(state)
        state.configuration = true
    },
    [MutationTypes.ViewLoose](state: State) {
        hideAll(state)
        state.loose = true
    },
    [MutationTypes.ViewWin](state: State) {
        hideAll(state)
        state.win = true
    }
}