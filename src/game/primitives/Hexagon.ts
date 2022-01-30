import Line from "./Line";

export default class Hexagon {
    used: boolean = false;
    lines: Line[] = [];
    outline: Line[] = [];
    neighbours: Hexagon[] = [];

    constructor(line1: Line, line2: Line, line3: Line, line4: Line, line5: Line, line6: Line) {
        this.lines.push(line1, line2, line3, line4, line5, line6);
    }
}