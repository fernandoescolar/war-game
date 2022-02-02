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

    assignInitialArmies(players: Player[], armiesPerPlayer: number, armiesPerHuman: number): void {
        players.forEach(player => {
            let armies = (player.interactive ? armiesPerHuman : armiesPerPlayer) - player.territories.length;
            player.territories.forEach(territory => territory.armies = 1);

            var operation = this.createAssignArmiesOperation(player, armies);
            this.applyAssignArmiesOperation(player, operation);
        });
    }

    createAssignArmiesOperation(player: Player, armies: number): number[] {
        const result = Array(player.territories.length).fill(0);
        while (armies > 0) {
            if (this.playerIsFull(player, result)) {
                break;
            }

            const index = Random.next(0, player.territories.length - 1);
            const territory = player.territories[index];
            if (territory.armies + result[index] >= this.configuration.maxArmies) continue;

            result[index]++;
            armies--;
        }

        return result;
    }

    applyAssignArmiesOperation(player: Player, armies: number[]): void {
        for (let i = 0; i < player.territories.length; i++) {
            player.territories[i].armies += armies[i];
        }
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

    private playerIsFull(player: Player, armiesToAdd: number[]): boolean {
        let result = true;
        for (let i = 0; i < player.territories.length; i++) {
            if (player.territories[i].armies + armiesToAdd[i] < this.configuration.maxArmies) {
                result = false;
                break;
            }
        }

        return result;
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
}