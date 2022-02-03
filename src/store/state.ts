import { State as ConfigurationState } from './modules/configuration'
import { State as ScreensState } from './modules/screens'
import { State as GameState } from './modules/game'
import { State as HistoryState } from './modules/history'

export type RootState = {
    configuration: ConfigurationState,
    screens: ScreensState,
    game: GameState,
    history: HistoryState
}