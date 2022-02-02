export type State = {
    players: { name: string, color: string, moves: number, successfulMoves: number, alive: boolean }[],
    currentPlayerId: number,
    startDate: Date,
    looseDate: Date | null,
    winDate: Date | null
}

export const state: State = {
    players: [],
    currentPlayerId: -1,
    startDate: new Date(),
    looseDate: null,
    winDate: null
}