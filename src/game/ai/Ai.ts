import Player from "../game/Player";
import { Action } from "../game/types";


export default abstract class Ai {
    protected player: Player | undefined;

    setPlayer(player: Player): void {
        this.player = player;
    }
    abstract getAction(): Promise<Action>;
}
