type WithDate = {
    date: Date
}
export type GameStart = {
    state: "game",
    players: { id: number, name: string, color: string }[],
    territories: { playerId: number, armies: number, outlines: { x: number, y: number }[]}[]
} & WithDate

export type TurnStart = {
    state: "turn",
    playerId: number
} & WithDate

export type Attack = {
    state: "attack",
    fromPlayerId: number,
    toPlayerId: number,
    fromTerritoryId: number,
    toTerritoryId: number,
    attack: number,
    defense: number
} & WithDate

export type AddArmies = {
    state: "armies",
    playerId: number,
    total: number,
    territories: { territoryId: number, armies: number } []
} & WithDate

export type Win = {
    state: "win",
    playerId: number,
} & WithDate

export type Log = GameStart | TurnStart | Attack | AddArmies | Win

export type Logger = (log: Log) => Promise<void>