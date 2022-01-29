import Point from "./Point";

export default class Line {
  points: Point[] = [];

  constructor(p1: Point, p2: Point) {
    this.points.push(p1, p2);
  }
}