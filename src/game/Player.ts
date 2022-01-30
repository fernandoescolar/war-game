import type { Action } from "./types";
import Territory from "./Territory";

export default abstract class Player {
    territories: Territory[] = [];
    moves: number = 0;
    interactive: boolean = true;

    constructor(public id: number, public readonly color: string) {
    }

    setTerritory(territory: Territory): void {
        if (!this.contains(territory)) {
            this.removeFromPreviousPlayer(territory);
            this.addToCurrentPlayer(territory);
        }
    }

    abstract getAction(): Promise<Action>;

    private contains(territory: Territory): boolean {
        return this.territories.indexOf(territory) >= 0;
    }

    private addToCurrentPlayer(territory: Territory): void {
        this.territories.push(territory);
        territory.player = this;
        territory.color = this.color;
    }

    private removeFromPreviousPlayer(territory: Territory): void {
        if (territory.player) {
            const index = territory.player.territories.indexOf(territory);
            territory.player.territories.splice(index, 1);
        }
    }
}