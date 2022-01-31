import { Configuration } from '@/game/game/types';

export type State = Configuration

export const state: State = {
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