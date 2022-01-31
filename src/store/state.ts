import { State as ConfigurationState } from './modules/configuration'
import { State as ScreensState } from './modules/screens'

export type RootState = {
    configuration: ConfigurationState,
    screens: ScreensState
}