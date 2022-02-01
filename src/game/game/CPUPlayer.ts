import { Action } from "./types";
import Player from "./Player";
import Ai from "../ai/Ai";

export default class CPUPlayer extends Player {
    constructor(id: number, color: string, protected readonly ai: Ai) {
        super(id, color);
        ai.setPlayer(this);
        this.interactive = false;
    }

    protected getNextAction(): Promise<Action> {
        return this.ai.getAction();
    }
}
