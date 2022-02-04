import type { Configuration } from "../game/types";
import Territory from "../game/Territory";
import Point from "../game/primitives/Point";
import Random from "../game/random-map/Random";
import IAnimation from "./IAnimation";
import NewArmyAnimation from "./NewArmyAnimation";
import PointsAnimation from "./PointsAnimation";

export default class CanvasTerritoryRenderer {
    readonly path: Path2D;
    private lastArmies: number = 0;
    private animations: IAnimation[] = [];

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

        const armies = this.animations.length === 0 ? this.armies : this.lastArmies;
        this.lastArmies = armies;
        this.context.font = `${this.configuration.fontSize} ${this.configuration.fontFamily}`;
        this.context.fillStyle = this.selected ? this.color : this.configuration.colors.text;
        this.context.fillText(armies.toString(), this.center.x - 4, this.center.y + 4);
        if (this.selected) {
            this.context.lineWidth = 1;
            this.context.strokeStyle = this.configuration.colors.bg;
            this.context.strokeText(armies.toString(), this.center.x - 4, this.center.y + 4);
        }

        this.animations.forEach(army => army.draw(this.context));
    }

    addNewArmies(armies: number, millis: number): void {
        Array(armies).fill(0).forEach(()=> {
            const source = new Point(Random.next(0, this.configuration.width), -20);
            const target = this.center;
            const speed = Random.next(100, millis);
            this.animations.push(new NewArmyAnimation(source, target, speed, this.color));
        });
    }

    showPoints(points: number, millis: number) {
        this.animations.push(new PointsAnimation(points, this.center, 20, 100, millis, this.color, this.configuration));
    }

    update(delta: number): void {
        this.animations.forEach(army => army.update(delta));
        let finished = this.animations.filter(army => army.finished);
        finished.forEach(army => {
            this.lastArmies++;
            this.animations.splice(this.animations.indexOf(army), 1);
        });
    }
}

