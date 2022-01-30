import { Action } from "./types";
import Player from "./Player";
import { skip } from "./Actions";


export default class CPUPlayer extends Player {
    constructor(id: number, color: string) {
        super(id, color);
    }

    getAction(): Promise<Action> {
        return new Promise(resolve => resolve(skip()));
    }
}
