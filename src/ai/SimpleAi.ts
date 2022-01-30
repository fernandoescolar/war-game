import { attack, skip } from "../game/Actions";
import Game from "../game/Game";
import { Action } from "../game/types";
import Ai from "./Ai";

export default class SimpleAi extends Ai {
    constructor(private readonly game: Game) {
        super();
    }

    getAction(): Promise<Action> {
        return new Promise((resolve) => {
            if (!this.game) return;
            if (!this.player) return;

            for(let i = 0; i < this.player.territories.length; i++) {
                const source = this.player.territories[i];
                const target = source.neighbours.find(neighbour => neighbour.player !== this.player && neighbour.armies < source.armies);
                if (target){
                    resolve(attack(source, target));
                    return;
                }
            }

            resolve(skip());
        });
    }
}