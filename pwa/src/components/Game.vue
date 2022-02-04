<template>
    <canvas ref="canvas"></canvas>
    <div :class="`grid columns-${players.length}`">
        <div class="grid-cell" v-for="player in players" :key="player.id" :style="`background-color: ${player.color}`">
            {{ player.interactive ? 'You' : 'CPU' }}
        </div>
        <div class="grid-mark" v-for="player in players" :key="`mark-${player.id}`">
            <svg v-if="player.id === current" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            <svg v-if="player.territories.length === 0" xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="red"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </div>
    </div>
    <footer>
        <div ref="status" id="status"></div>
        <button ref="skip">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg>
        </button>
    </footer>
</template>

<script lang="ts">
import { onMounted, onUnmounted,  Ref, ref, unref, watch } from 'vue'
import type { Configuration } from '@/game/game/types'
import GameController from '@/game'
import CanvasRenderer from '@/game/canvas/CanvasRenderer'
import CanvasInput from '@/game/canvas/CanvasInput'
import Player from '@/game/game/Player'
import { ConfigurationState, GameActions, ScreensActions, mapActions, mapGetters } from '@/store'
import GameLogger from './GameLogger'

const fixCanvas = (canvas: HTMLCanvasElement): void => {
    const width = Math.min(512, window.innerWidth)
    const height = window.innerHeight - 150

    canvas.width = width
    canvas.height = height
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'
}

const fixConfiguration = (configuration: Configuration, canvas: HTMLCanvasElement) => {
    configuration.offsetX = Math.max(10, canvas.width - configuration.width) / 2
    configuration.offsetY = 10
    configuration.height = canvas.height - configuration.offsetY * 2
}

const unrefAll = (obj: any): any => {
    const newObj: any = {}
    for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
            const value = obj[key]
            newObj[key] = unref(value)
        }
    }

    return newObj;
}



export default {
    setup() {
        const canvas: Ref<HTMLCanvasElement | null> = ref(null)
        const skip: Ref<HTMLElement | null> = ref(null)
        const status: Ref<HTMLElement | null> = ref(null)
        const players: Ref<Player[]> = ref([])
        const current: Ref<number> = ref(0)
        const winner: Ref<number> = ref(-1)
        const toRefConfiguration = mapGetters<ConfigurationState>('configuration')
        const { Update, Reset } = mapActions<GameActions>('game')
        const { ViewWin } = mapActions<ScreensActions>('screens')
        let controller: GameController | undefined;
        let interval: NodeJS.Timer | undefined;

        const initialize = (): boolean => {
            if (canvas.value) {
                Reset()
                const configuration = unrefAll(toRefConfiguration) as Configuration
                fixCanvas(canvas.value)

                const context = canvas.value.getContext("2d") as CanvasRenderingContext2D
                const renderer = new CanvasRenderer(configuration, context)
                const input = new CanvasInput(renderer, skip.value as HTMLElement)
                const logs = new GameLogger(status.value as HTMLElement)
                controller = new GameController(renderer, input, log => logs.loggger(log))
                return true
            }

            return false
        }

        const start = () => {
            if (!controller) {
                return
            }

            const configuration = unrefAll(toRefConfiguration) as Configuration
            fixConfiguration(configuration, canvas.value!)
            controller.initialize(configuration)

            if (interval) {
                clearInterval(interval)
            }

            interval = setInterval(() => {
                if (!controller) {
                    return
                }
                Update({ game: controller.game, startDate: controller.startDate, winDate: controller.winDate, looseDate: controller.looseDate })
                current.value = controller.currentPlayerId
                winner.value = controller.winner?.id ?? -1
                if (winner.value >= 0) {
                    clearInterval(interval)
                    if (controller.game.players[winner.value].interactive) {
                        ViewWin()
                    }
                }
            }, 200)

            controller.start()
            players.value = [ ...controller.players ]
        }

        onMounted(() => {
            if (initialize()) {
                start()
            }
        })

        onUnmounted(() => {
            if (interval) {
                clearInterval(interval)
                interval = undefined
            }
        })

        return {
            canvas,
            skip,
            status,
            players,
            current
        }
    }
}
</script>

<style lang="scss">
@import "../sass/variables";

.grid {
    display: grid;
    font-family: $game-font-family;
    margin-left: 0.2em;
    margin-right: 0.2em;
    grid-gap: 0.2em;

@for $i from 2 through 8 {
    &.columns-#{$i} {
        grid-template-columns: repeat(#{$i}, minmax(0, 1fr));
    }
}

    .grid-cell {
        border-radius: 5px;
        text-align: center;
        color: $game-text;
    }

    .grid-mark svg {
        display: block;
        margin: auto;
        width: 15px;
        height: 15px;
        color: $text;
    }
}

footer {
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    height: 50px;

    button {
        padding: 0.4em;
        border: 2px solid $lines;
        background-color: $accent;
        color: $background;
        width: 42px;
        text-align: center;
        align-content: center;

        &:hover {
            color: $background;
        }
    }

    #status {
        width: calc(100% - 42px - 0.6em);
        margin-left: 0.2em;
        font-family: $game-font-family;
        font-size: $game-font-size;
        pointer-events: none;
    }
}
</style>
