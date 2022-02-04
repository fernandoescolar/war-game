export default class Point {
  constructor(public x: number, public y: number) {
  }

  distance(p: Point) : number {
    return Math.sqrt(Math.pow(this.x - p.x, 2) + Math.pow(this.y - p.y, 2));
  }
}