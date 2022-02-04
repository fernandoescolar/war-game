import { InjectionKey, computed, ToRefs } from 'vue';
import { createStore, Store, useStore as baseUseStore } from 'vuex'

import { module as configuration } from './modules/configuration'
import { module as screens } from './modules/screens'
import { module as game } from './modules/game'
import { module as history } from './modules/history'

import type { RootState } from './state';
import type { State as ConfigurationState } from './modules/configuration'
import type { State as ScreensState } from './modules/screens'
import type { State as GameState } from './modules/game'
import type { State as HistoryState } from './modules/history'

import type { Actions as ConfigurationActions } from './modules/configuration'
import type { Actions as ScreensActions } from './modules/screens'
import type { Actions as GameActions } from './modules/game'
import type { Actions as HistoryActions } from './modules/history'

const key: InjectionKey<Store<RootState>> = Symbol()

const store = createStore<RootState>({
    modules: {
        configuration,
        screens,
        game,
        history
    }
})

function useStore() {
    return baseUseStore(key)
}

function mapGetters<T>(module: string): ToRefs<T> {
    const store = useStore()
    const getters = Object.fromEntries(Object.keys(store.getters).map(getter => (module !== undefined && getter.startsWith(module)) ? [getter.substr(module.length + 1), computed(() => store.getters[getter])] : [getter, computed(() => store.getters[getter])]))
    return getters as unknown as ToRefs<T>
}

function mapActions<T>(module: string): T {
    const store = useStore() as any
    const actions = Object.fromEntries(Object.keys(store._actions).map(action => (module !== undefined && action.startsWith(module)) ? [action.substr(module.length + 1), (value: any) => store.dispatch(action, value)] : [action, (value: any) => store.dispatch(action, value)]))
    return actions as unknown as T
}

export {
    RootState,
    store,
    key,
    useStore,
    mapGetters,
    mapActions,
    ConfigurationState,
    ScreensState,
    GameState,
    HistoryState,
    ConfigurationActions,
    ScreensActions,
    GameActions,
    HistoryActions
}