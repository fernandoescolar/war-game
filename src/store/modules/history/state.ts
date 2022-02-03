import { Log } from "@/game/logs"

export type State = {
    logs: Log[],
    lines: string[]
}

export const state: State = {
    logs: [],
    lines: []
}