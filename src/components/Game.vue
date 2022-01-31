<script lang="ts">
import { onMounted, Ref, ref } from 'vue'
import type { Configuration } from '@/game/game/types'
import GameController from '@/game'
import CanvasRenderer from '@/game/canvas/CanvasRenderer'
import CanvasInput from '@/game/canvas/CanvasInput'

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
    font: '14px Verdana'
}

export default {
    setup() {
        const canvas: Ref<HTMLCanvasElement | null> = ref(null)
        const skip: Ref<HTMLElement | null> = ref(null)

        onMounted(() => {
            if (canvas.value) {
                const context = canvas.value.getContext("2d") as CanvasRenderingContext2D
                const renderer = new CanvasRenderer(configuration, context)
                const input = new CanvasInput(renderer, skip.value as HTMLElement)
                const controller = new GameController(renderer, input)

                controller.start(configuration)
            }
        })

        return {
            canvas,
            skip
        }
    }
}
</script>

<template>
    <div class="flex flex-col container w-full max-w-lg pb-2 md:pb-5 px-2 mx-auto gap-2">
        <canvas ref="canvas"></canvas>
        <button id="skip" ref="skip">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11.933 12.8a1 1 0 000-1.6L6.6 7.2A1 1 0 005 8v8a1 1 0 001.6.8l5.333-4zM19.933 12.8a1 1 0 000-1.6l-5.333-4A1 1 0 0013 8v8a1 1 0 001.6.8l5.333-4z"></path></svg>
        </button>
    </div>
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
    bottom: 20px;
    font-family: "Super Mario";
    font-size: 20px;
    width: 100%;
    background-attachment: rgba(0, 0, 0, 0);
    pointer-events: none;
    width: calc(100% - 80px);
}

#skip {
    position: relative;
    top: -10px;
    font-family: "Super Mario";
    font-size: 20px;
    padding: 0.4em;
    border: 2px solid $color10;
    background-color: $color09;
    color: $color01;
    width: 42px;
    text-align: center;
    align-content: center;
}
</style>
