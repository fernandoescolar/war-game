import type { Action } from "./types";
import Player from "./Player";
import CanvasInput from "../IInput";

export default class HumanPlayer extends Player {
    constructor(id: number, color: string, private input: CanvasInput) {
        super(id, color);
    }

    protected getNextAction(): Promise<Action> {
        return this.input.getAction();
    }
}

