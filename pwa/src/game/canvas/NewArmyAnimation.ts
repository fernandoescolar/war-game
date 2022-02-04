import Point from "../game/primitives/Point";
import IAnimation from "./IAnimation";

export default class NewArmyAnimation implements IAnimation {
    private readonly speedX: number;
    private readonly speedY: number;
    public position: Point;

    get finished(): boolean {
        return this.position.x === this.to.x && this.position.y === this.to.y;
    }

    constructor(private readonly from: Point, private readonly to: Point, private readonly millis: number, private readonly color: string) {
        this.speedX = (to.x - from.x) / millis;
        this.speedY = (to.y - from.y) / millis;
        this.position = from;
    }

    update(delta: number): void {
        this.position.x += this.speedX * delta;
        this.position.y += this.speedY * delta;

        if (this.position.x > this.to.x && this.speedX > 0) {
            this.position.x = this.to.x;
        }
        if (this.position.x < this.to.x && this.speedX < 0) {
            this.position.x = this.to.x;
        }
        if (this.position.y > this.to.y && this.speedY > 0) {
            this.position.y = this.to.y;
        }
        if (this.position.y < this.to.y && this.speedY < 0) {
            this.position.y = this.to.y;
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.position.x, this.position.y, 5, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.stroke();
    }
}
