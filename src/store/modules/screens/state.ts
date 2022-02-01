export type State = {
    start: boolean,
    game: boolean,
    about: boolean,
    statistics: boolean,
    configuration: boolean,
    loose: boolean,
    win: boolean
}

export const state: State = {
    start: false,
    game: false,
    about: false,
    statistics: false,
    configuration: true,
    loose: false,
    win: false
}