import { Configuration } from '@/game/game/types'
import styles from '@/sass/_exports.scss'

const vars: any = {};
styles.replace(/\"/g, '')
      .replace(':export {', '')
      .replace('}', '')
      .replace(/\n/g, '')
      .split(';')
      .map(line => {
        const [key, value] = line.split(':')
        if (key && value) {
            vars[key.trim()] = value.trim()
        }
      })

export type State = Configuration & { games: number}

export const state: State = {
    width: 350,
    height: 630,
    offsetX: 10,
    offsetY: 10,
    hexagonSize: 30,
    numberOfAreas: 30,
    numberOfPlayers: 5,
    areaSizeVariance: 0.1,
    useDistortion: true,
    useCompactShapes: true,
    maxArmies: 10,
    initialArmies: 20,
    humanInitialArmies: 20,
    humanPlayerAlwaysFirst: false,
    humanPlayerColor: vars.player1,
    colors: {
        players: [vars.player1, vars.player2, vars.player3, vars.player4, vars.player5, vars.player6 ],
        disabled: vars.disabled,
        seleted: vars.selected,
        line: vars.lines,
        text: vars.gameText,
        shadow: vars.shadow,
        bg: vars.background
    },
    fontSize: vars.gameFontSize,
    fontFamily: vars.gameFontFamily,
    games: 0
}