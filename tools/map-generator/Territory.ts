import Point from "./Point";

export default class Territory {
    id: number;
    outline: Point[];
    center: Point;
    armies: number = 0;
    neighbours: number[] = [];
    playerId!: number;

    constructor(id: number, outline: Point[], center: Point) {
        this.id = id;
        this.outline = outline;
        this.center = center;
    }
}
