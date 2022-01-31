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
    start: true,
    game: false,
    about: false,
    statistics: false,
    configuration: false,
    loose: false,
    win: false
}