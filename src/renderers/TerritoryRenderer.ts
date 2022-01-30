import type { Configuration } from "../game/types";
import Territory from "../game/Territory";

export default class TerritoryRenderer {
    constructor(private readonly configuration: Configuration) {
    }

    drawFirstLayer(territory: Territory, context: CanvasRenderingContext2D): void {
        context.strokeStyle = this.configuration.colors.line;
        context.lineWidth = 2;
        context.stroke(territory.path);
    }

    drawSecondLayer(territory: Territory, context: CanvasRenderingContext2D) : void {
        context.fillStyle = territory.active ? territory.color : territory.selected ? this.configuration.colors.seleted : this.configuration.colors.disabled;
        context.fill(territory.path);
        context.strokeStyle = this.configuration.colors.line;
        context.lineWidth = 2;
        context.stroke(territory.path);
    }

    drawThirdLayer(territory: Territory, context: CanvasRenderingContext2D) : void {
        if (!territory.active && !territory.selected) return;

        context.font = this.configuration.font;
        context.fillStyle = this.configuration.colors.text;
        context.fillText(territory.armies.toString(), territory.center.x, territory.center.y);
        if (territory.selected) {
            context.strokeStyle = territory.color;
            context.lineWidth = 1;
            context.strokeText(territory.armies.toString(), territory.center.x, territory.center.y);
        }
    }
}