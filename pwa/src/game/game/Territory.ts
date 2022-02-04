import Point from "./primitives/Point";
import Player from "./Player";

export default class Territory {
    color: string = "rgba(0, 0, 0, 0.5)";
    selected: boolean = false;
    active: boolean = true;
    armies: number = 0;
    neighbours: Territory[] = [];
    player: Player | undefined = undefined;

    constructor(public readonly id: number, public readonly outline: Point[], public readonly center: Point) {
    }
}
