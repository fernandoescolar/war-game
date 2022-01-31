import type { Configuration } from "../game/types";
import Territory from "../game/Territory";
import Point from "../game/primitives/Point";

export default class CanvasTerritoryRenderer {
    readonly path: Path2D;

    get center(): Point {
        return new Point(this.territory.center.x + this.configuration.offsetX, this.territory.center.y + this.configuration.offsetY);
    }

    get active(): boolean {
        return this.territory.active;
    }

    get selected(): boolean {
        return this.territory.selected;
    }

    get armies(): number {
        return this.territory.armies;
    }

    get color(): string {
        return this.territory.color;
    }

    constructor(public readonly territory: Territory, private readonly context: CanvasRenderingContext2D, private readonly configuration: Configuration) {
        this.path = new Path2D();
        for(let i = 0; i < territory.outline.length; i++) {
            if (i === 0) {
                this.path.moveTo(territory.outline[i].x + configuration.offsetX, territory.outline[i].y + configuration.offsetY);
            } else {
                this.path.lineTo(territory.outline[i].x + configuration.offsetX, territory.outline[i].y + configuration.offsetY);
            }
        }
    }

    drawFirstLayer(): void {
        this.context.strokeStyle = this.configuration.colors.line;
        this.context.lineWidth = 2;
        this.context.stroke(this.path);
    }

    drawSecondLayer() : void {
        this.context.fillStyle = this.active ? this.color : this.selected ? this.configuration.colors.seleted : this.configuration.colors.disabled;
        this.context.fill(this.path);
        this.context.strokeStyle = this.configuration.colors.line;
        this.context.lineWidth = 2;
        this.context.stroke(this.path);
    }

    drawThirdLayer() : void {
        if (!this.active && !this.selected) return;

        this.context.font = this.configuration.font;
        this.context.fillStyle = this.configuration.colors.text;
        this.context.fillText(this.armies.toString(), this.center.x, this.center.y);
        if (this.selected) {
            this.context.strokeStyle = this.color;
            this.context.lineWidth = 1;
            this.context.strokeText(this.armies.toString(), this.center.x, this.center.y);
        }
    }
}