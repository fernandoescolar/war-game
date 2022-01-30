import type { Configuration } from "./types";
import MapGenerator from "./random-map/MapGenerator";
import Random from "./random-map/Random";
import Player from "./Player";
import Territory from "./Territory";

export default class Board {
    territories!: Territory[];

    constructor(public configuration: Configuration) {
    }

    new(): void {
        this.territories = Board.createMap(this.configuration);
    }

    assignTerritories(players: Player[]): void {
        this.territories.forEach(territory => players[Random.next(0, players.length - 1)].setTerritory(territory));
    }

    assignInitialArmies(players: Player[], armiesPerPlayer: number): void {
        players.forEach(player => {
            let armies = armiesPerPlayer - player.territories.length;
            player.territories.forEach(territory => territory.armies = 1);

            this.assignPlayerArmies(player, armies);
        });
    }

    async assignPlayerArmies(player: Player, armiesToAdd: number, delay: number = 0): Promise<void> {
        let armies = armiesToAdd;
        while (armies > 0) {
            const territory = player.territories[Random.next(0, player.territories.length - 1)];
            if (player.territories.findIndex(x => x.armies < this.configuration.maxArmies) < 0) return;
            if (territory.armies >= this.configuration.maxArmies) continue;
            if (delay > 0) {
                this.disableAll();
                territory.active = true;
                await Board.wait(delay);
                territory.armies++;
                armies--;
                await Board.wait(delay);
            } else {
                territory.armies++;
                armies--;
            }
        }

        this.resetState();
    }

    resetState(): void {
        this.territories.forEach(territory => {
            territory.selected = false;
            territory.active = true;
        });
    }

    disableAll(): void {
        this.territories.forEach(territory => {
            territory.selected = false;
            territory.active = false;
        });
    }

    selectAttackerTerritory(territory: Territory): void {
        this.disableAll();
        territory.selected = true;
        territory.neighbours.forEach(neighbour => neighbour.active = neighbour.player !== territory.player);
    }

    selectDefenderTerritory(territory: Territory): void {
        territory.active = false;
        territory.selected = true;
    }

    private static createMap(configuration: Configuration): Territory[] {
        const generator = new MapGenerator();
        generator.createHexagonPattern(
            configuration.width,
            configuration.height,
            configuration.hexagonSize,
            configuration.useDistortion
        );

        generator.generate(
            configuration.numberOfAreas,
            configuration.areaSizeVariance,
            configuration.useCompactShapes
        );

        return generator.getTerritories();
    }

    private static async wait(ms: number): Promise<void> {
        return new Promise<void>(resolve => setTimeout(resolve, ms));
    }
}