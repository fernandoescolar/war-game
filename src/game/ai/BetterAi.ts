import { attack, skip } from "../game/Actions";
import Game from "../game/Game";
import Territory from "../game/Territory";
import { Action } from "../game/types";
import Ai from "./Ai";

type TerrotoryInfo = {
    friendly_neighbors: number,
    unfriendly_neighbors: number,
    highest_friendly_neighbor_dice: number,
    highest_unfriendly_neighbor_dice: number,
    second_highest_unfriendly_neighbor_dice: number,
    num_neighbors: number
};

export default class BetterAi extends Ai {
    constructor(private readonly game: Game) {
        super();
    }

    getAction(): Promise<Action> {
        return new Promise((resolve) => {
            if (!this.game) return;
            if (!this.player) return;
            const maxAdjacentTerritories = this.getMaxAdjacentTerritories();
            const infos = this.game.board.territories.map(territory => this.getTerritoryInfo(territory));

            let source: Territory | undefined;
            let target: Territory | undefined;
            for(let i = 0; i < this.player.territories.length; i++) {
                const territory: Territory = this.player.territories[i];
                if (territory.armies <= 1) continue;

                for(let j = 0; j < territory.neighbours.length; j++) {
                    const neighbour: Territory = territory.neighbours[j];
                    if (neighbour.player === this.player) continue;
                     // is the attacker actually in a position to attack?
                    if (territory.armies >= neighbour.armies && neighbour.armies != this.game.configuration.maxArmies) continue;
                    // does winning invite a strong counter attack?
                    if (infos[territory.id].highest_friendly_neighbor_dice > neighbour.armies ) continue;
                    // does the attacker have something to defend from (and I have a meaningful connected area)?
                    if (maxAdjacentTerritories > 4
                        && infos[neighbour.id].second_highest_unfriendly_neighbor_dice > 2
                        && this.game.currentSuccessfulAttackMovements === 0) continue;

                    // check against previous attacker
                    if (!source) {
                        source = territory;
                        target = neighbour;
                        continue;
                    }

                    if (infos[source.id].unfriendly_neighbors === 1) { // if it's the only way out
                        if (infos[neighbour.id].unfriendly_neighbors === 1 ) { // ...for both of them
                            if (neighbour.armies < source.armies ) continue; // prefer larger dice
                            else if (neighbour.armies === source.armies)
                                // then prefer the less connected region
                                if (infos[neighbour.id].num_neighbors < infos[source.id].num_neighbors )
                                    continue

                        } else continue; // let the other one out first
                    }

                    source = territory;
                    target = neighbour;
                }
            }

            if (source && target) {
                resolve(attack(source, target));
                return;
            }

            resolve(skip());
        });
    }

    private getTerritoryInfo(territory: Territory): TerrotoryInfo {
        let friendly_neighbors = 0;
        let unfriendly_neighbors = 0;
        let highest_friendly_neighbor_armies = 0;
        let highest_unfriendly_neighbor_armies = 0;
        let second_highest_unfriendly_neighbor_armies = 0;
        let num_neighbors = territory.neighbours.length

        territory.neighbours.forEach(neighbour => {
            const armies = neighbour.armies;
            if (neighbour.player === this.player) {
                friendly_neighbors++;
                if (highest_friendly_neighbor_armies < armies) {
                    highest_friendly_neighbor_armies = armies;
                }
            } else {
                unfriendly_neighbors++;
                if (highest_unfriendly_neighbor_armies < armies) {
                    second_highest_unfriendly_neighbor_armies = highest_unfriendly_neighbor_armies;
                    highest_unfriendly_neighbor_armies = armies;
                }
                else if (second_highest_unfriendly_neighbor_armies < armies) {
                    second_highest_unfriendly_neighbor_armies = armies;
                }
            }
        });

        return {
            friendly_neighbors,
            unfriendly_neighbors,
            highest_friendly_neighbor_dice: highest_friendly_neighbor_armies,
            highest_unfriendly_neighbor_dice: highest_unfriendly_neighbor_armies,
            second_highest_unfriendly_neighbor_dice: second_highest_unfriendly_neighbor_armies,
            num_neighbors
        }
    }

    private getAdjacentTerritories(territory: Territory): number {
        let counter = 0;
        territory.neighbours.forEach(neighbour => {
            if (neighbour.player === this.player) {
                counter++;
            }
        });

        return counter;
    }

    private getMaxAdjacentTerritories(): number {
        if (!this.player) return 0;

        let max = 0;
        this.player.territories.forEach(neighbour => {
            if (neighbour.player === this.player) {
                max = Math.max(this.getAdjacentTerritories(neighbour) + 1, max);
            }
        });

        return max;
    }
}