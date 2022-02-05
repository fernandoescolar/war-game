import { attack, skip } from "../game/Actions";
import Game from "../game/Game";
import Random from "../game/random-map/Random";
import Territory from "../game/Territory";
import { Action } from "../game/types";
import Ai from "./Ai";

export default class DefaultAi extends Ai {
    constructor(private readonly game: Game) {
        super();
    }

    getAction(): Promise<Action> {
        return new Promise((resolve) => {
            if (!this.game) return;
            if (!this.player) return;

            const players = this.game.players.map(p => {
                return {
                    totalArmies: p.territories.reduce((acc, t) => acc + t.armies, 0),
                    totalTerritories: p.territories.length,
                    ranking: p.id
                }
            });

            const totalArmies = players.reduce((acc, p) => acc + p.totalArmies, 0);

            for(let i = 0; i < players.length - 1; i++) {
                for(let j = i + 1; j< players.length - 1; j++) {
                    if(players[i].totalArmies < players[j].totalArmies ) {
                        const tmp = players[i].ranking;
                        players[i].ranking = players[j].ranking;
                        players[j].ranking = tmp;
                    }
                }
            }

            let topPlayer = -1;
            for(let i = 0; i < players.length - 1; i++) {
                if( players[i].totalArmies > totalArmies * 2/5) {
                    topPlayer = i;
                }
            }

            for(let i = 0; i < this.player.territories.length; i++) {
                const source: Territory = this.player.territories[i];
                if (source.armies <= 1) continue;

                for(let j = 0; j < source.neighbours.length; j++) {
                    const neighbour = source.neighbours[j];
                    if (neighbour.player === this.player) continue;
                    if (topPlayer >= 0 && this.player.id !== topPlayer && neighbour.player?.id !== topPlayer) continue;
                    if (neighbour.armies > source.armies) continue;
                    if  (neighbour.armies === source.armies && source.player?.id !== topPlayer) continue;
                    if  (neighbour.armies === source.armies && neighbour.player?.id !== topPlayer) continue;
                    if  (neighbour.armies === source.armies && Random.next(0, 1)) continue;

                    resolve(attack(source, neighbour));
                    return;
                }
            }

            resolve(skip());
        });
    }
}