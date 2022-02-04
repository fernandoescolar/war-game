import { Action } from "./game/types";
import Game from "./game/Game";


export default interface IInput {
    game: Game;
    initialize(game: Game): void;
    getAction(): Promise<Action>;
}
