import Game from '@/game/game/Game'
import { RootState } from '@/store/state'
import { ActionTree } from 'vuex'
import { MutationTypes } from './mutations'
import { State } from './state'

export type Actions = {
    Update(data: { game: Game, startDate: Date, winDate: Date | undefined, looseDate: Date | undefined }): void,
    Reset(): void,
}

export const actions: ActionTree<State, RootState> = {
    Update({ commit }, data: { game: Game, startDate: Date, winDate: Date | undefined, looseDate: Date | undefined }) {
        commit(MutationTypes.SetPlayers, data.game.players)
        commit(MutationTypes.SetCurrentPlayerId, data.game.currentPlayer.id)
        commit(MutationTypes.SetStartDate, data.startDate)
        if (data.winDate) {
            commit(MutationTypes.SetWinDate, data.winDate)
        }
        if (data.looseDate) {
            commit(MutationTypes.SetLooseDate, data.looseDate)
        }
    },
    Reset({ commit }) {
        commit(MutationTypes.Reset)
    }
}
