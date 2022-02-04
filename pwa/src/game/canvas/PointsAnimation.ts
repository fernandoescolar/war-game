import Point from "../game/primitives/Point";
import { Configuration } from "../game/types";
import IAnimation from "./IAnimation";

export default class PointsAnimation implements IAnimation {
    private readonly growth: number;
    private size: number;
    private lastMeasure: TextMetrics | undefined;

    get finished(): boolean {
        return this.size === this.max;
    }

    constructor(private readonly score: number, private readonly point: Point, private readonly min: number, private readonly max: number, private readonly millis: number, private readonly color: string, private readonly configuration: Configuration) {
        this.growth = (max - min) / millis;
        this.size = min;
    }

    update(delta: number): void {
        this.size += this.growth * delta;
        if (this.size > this.max) {
            this.size = this.max;
        }
    }

    draw(context: CanvasRenderingContext2D): void {
        context.font = `${this.size}px ${this.configuration.fontFamily}`;
        context.fillStyle = this.color;

        const measure = context.measureText(this.score.toString());
        if (this.lastMeasure) {
            this.point.x -= (this.lastMeasure.width - measure.width) / 2;
        }
        this.lastMeasure = measure;

        context.fillText(this.score.toString(), this.point.x - 10, this.point.y + 10);
        context.strokeText(this.score.toString(), this.point.x - 10, this.point.y + 10);
    }
}
