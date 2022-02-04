import Game from "./game/Game";

export default interface IRenderer {
    game: Game;
    initialize(game: Game): void;
    initializeTerritories(): void;
    draw(): void;
    addArmies(territoryId: number, armies: number, millis: number): Promise<void>;
    showPoints(points: {[territoryId: number]: number}, millis: number): Promise<void>;
}
