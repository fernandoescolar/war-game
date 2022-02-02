import { MutationTree } from 'vuex'
import { State } from './state'
import Player from '@/game/game/Player'

export enum MutationTypes {
    SetPlayers = 'SET_PLAYERS',
    SetCurrentPlayerId = 'SET_CURRENT_PLAYER_ID',
    SetStartDate = 'SET_START_DATE',
    SetWinDate = 'SET_WIN_DATE',
    SetLooseDate = 'SET_LOOSE_DATE',
    Reset = 'RESET_GAME'
}

export const mutations: MutationTree<State> = {
    [MutationTypes.SetPlayers](state: State, players: Player[]) {
        state.players = players.map(player => { return { name: player.interactive ? 'You' : 'CPU', color: player.color, moves: player.moves, successfulMoves: player.successfulMoves, alive: player.territories.length > 0 }})
    },
    [MutationTypes.SetCurrentPlayerId](state: State, playerId: number) {
        state.currentPlayerId = playerId
    },
    [MutationTypes.SetStartDate](state: State, date: Date) {
        state.startDate = date
    },
    [MutationTypes.SetWinDate](state: State, date: Date) {
        state.winDate = date
    },
    [MutationTypes.SetLooseDate](state: State, date: Date) {
        state.looseDate = date
    },
    [MutationTypes.Reset](state: State) {
        state.players = []
        state.startDate = new Date()
        state.winDate = null
        state.looseDate = null
    }
}