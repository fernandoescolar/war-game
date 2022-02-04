import { RootState } from '@/store/state'
import { GetterTree } from 'vuex'
import { State, state } from './state'

const g: GetterTree<State, RootState> = {}
Object.keys(state).forEach(key => {
    g[key] = (s) => (s as any)[key] as any
})

export const getters = g