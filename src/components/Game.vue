<script lang="ts">
import { onMounted, Ref, ref } from 'vue'
import type { Configuration } from '@/game/game/types'
import GameController from '@/game'
import CanvasRenderer from '@/game/canvas/CanvasRenderer'
import CanvasInput from '@/game/canvas/CanvasInput'
import Player from '@/game/game/Player'

const configuration: Configuration = {
    width: 350,
    height: 630,
    offsetX: 10,
    offsetY: 10,
    hexagonSize: 30,
    numberOfAreas: 30,
    areaSizeVariance: 0.1,
    useDistortion: true,
    useCompactShapes: true,
    maxArmies: 10,
    initialArmies: 20,
    colors: {
        players: ['#ef476f', '#ffd166', '#06d6a0', '#593837', '#2B59C3'],
        disabled: '#2D3047',
        seleted: '#0C0F0A',
        line: '#0C0F0A',
        text: '#fffcf9',
        shadow: '#2D3047',
        bg: '#fffcf9'
    },
    fontSize: 20,
    fontFamily: 'Super Mario'
}

export default {
    setup() {
        const canvas: Ref<HTMLCanvasElement | null> = ref(null)
        const skip: Ref<HTMLElement | null> = ref(null)
        const players: Ref<Player[]> = ref([])
        const current: Ref<number> = ref(0)

        onMounted(() => {
            if (canvas.value) {
                const context = canvas.value.getContext("2d") as CanvasRenderingContext2D
                const renderer = new CanvasRenderer(configuration, context)
                const input = new CanvasInput(renderer, skip.value as HTMLElement)
                const controller = new GameController(renderer, input)

                controller.start(configuration)
                players.value = controller.game.players
                setInterval(() => {
                    current.value = controller.game.currentPlayer.id
                }, 200)
            }
        })

        return {
            canvas,
            skip,
            players,
            current
        }
    }
}
</script>

<template>
    <div class="flex flex-col container w-full max-w-lg pb-2 md:pb-5 px-2 mx-auto gap-2">
        <canvas ref="canvas"></canvas>
          <div class="grid grid-cols-5 gap-1">
            <div class="grid-cell" v-for="player in players" :key="player.id" :style="`background-color: ${player.color}`">
                {{ player.interactive ? 'You' : 'CPU' }}
            </div>
             <div class="grid-mark" v-for="player in players" :key="`mark-${player.id}`">
                <svg v-if="player.id === current" class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg>
            </div>
        </div>
    </div>
    <button id="skip" ref="skip">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg>
    </button>
    <div id="status"></div>
</template>

<style lang="scss">
$color01: #fffcf9; // bg
$color02: #ef476f;
$color03: #ffd166;
$color04: #06d6a0;
$color05: #2b59c3;
//$color06: #320E3B
$color07: #593837;
//$color08: #084B83
$color09: #2d3047; // disabled
$color10: #0c0f0a; //lines

#status {
    position: fixed;
    bottom: 10px;
    left: 10px;
    font-family: "Super Mario";
    font-size: 20px;
    width: 100%;
    background-attachment: rgba(0, 0, 0, 0);
    pointer-events: none;
    width: calc(100% - 80px);
}

#skip {
    position: fixed;
    bottom: 40px;
    right: 20px;
    font-family: "Super Mario";
    font-size: 20px;
    padding: 0.4em;
    border: 2px solid $color10;
    background-color: $color09;
    color: $color01;
    width: 42px;
    text-align: center;
    align-content: center;
    display: block;
    margin: auto;
}

.grid-cell {
    border: 2px solid $color01;
    border-radius: 5px;
    font-family: 'Super Mario';
    text-align: center;
}

.grid-mark svg {
    display: block;
    margin: auto;
}
</style>
