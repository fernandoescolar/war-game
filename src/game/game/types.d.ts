import DiceRoll from "./DiceRolling";
import Territory from "./Territory";

export type ActionAttack = {
    source: Territory,
    target: Territory
};

export type ActionSkip = {
    skip: boolean
};

export type Action = ActionAttack | ActionSkip;

export type Configuration ={
    width: number,
    height: number,
    offsetX: number,
    offsetY: number,
    hexagonSize: number,
    numberOfAreas: number,
    areaSizeVariance: number,
    useDistortion: boolean,
    useCompactShapes: boolean,
    maxArmies: number,
    initialArmies: number,
    colors: {
        players: string[],
        disabled: string,
        seleted: string,
        line: string,
        text: string,
        shadow: string,
        bg: string
    },
    fontFamily: string,
    fontSize: number
}

export type Movement ={
    attacker: Territory,
    defender: Territory,
    attack: DiceRoll,
    defense: DiceRoll
}
