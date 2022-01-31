import Game from "./game/Game";

export default interface IRenderer {
    game: Game;
    initialize(game: Game): void;
    draw(): void;
    addArmies(territoryId: number, armies: number): Promise<void>;
}
