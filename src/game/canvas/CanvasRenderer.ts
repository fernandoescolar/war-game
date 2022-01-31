import IRenderer from "../IRenderer";
import type { Configuration } from "../game/types";
import Game from "../game/Game";
import CanvasTerritoryRenderer from "./CanvasTerritoryRenderer";

export default class CanvasRenderer implements IRenderer {
    territories: CanvasTerritoryRenderer[] = [];
    game!: Game;
    armiesToAdd: number[] = [];

    constructor(public readonly configuration: Configuration, public readonly context: CanvasRenderingContext2D) {
        const width = Math.min(512, window.innerWidth);
        const height = window.innerHeight - 150;
        this.context.canvas.width = width;
        this.context.canvas.height = height;
        this.context.canvas.style.width = width + 'px';
        this.context.canvas.style.height = height + 'px';
        this.configuration.offsetX = Math.max(10, this.context.canvas.width - this.configuration.width) / 2;
        this.configuration.offsetY = 10;
    }

    initialize(game: Game): void {
        this.game = game;

        // fix Y offset
        const minY = Math.min(...this.game.board.territories.map(t => Math.min(...t.outline.map(p => p.y))));
        this.configuration.offsetY = this.configuration.offsetY - minY;

        this.territories = this.game.board.territories.map(territory => new CanvasTerritoryRenderer(territory, this.context, this.configuration));
    }

    draw(): void {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
        this.drawFirstLayer();
        this.drawSecondLayer();
        this.drawThirdLayer();
    }

    addArmies(territoryId: number, armies: number): Promise<void> {
        return new Promise((resolve, reject) => { resolve() });
    }

    private drawFirstLayer(): void {
        this.context.shadowOffsetY = 4;
        this.context.shadowBlur = 4;
        this.context.shadowColor = this.configuration.colors.shadow;
        this.territories.forEach(territory => territory.drawFirstLayer());
    }

    private drawSecondLayer(): void {
        this.context.shadowOffsetY = 0;
        this.context.shadowBlur = 0;
        this.context.shadowColor = "rgba(0, 0, 0, 0.0)";
        this.territories.forEach(territory => territory.drawSecondLayer());
    }

    private drawThirdLayer(): void {
        this.territories.forEach(territory => {
            territory.drawThirdLayer();
            if (this.armiesToAdd.length > 0) {
                const index = this.game.currentPlayer.territories.indexOf(territory.territory);
                if (index >= 0 && this.armiesToAdd[index] > 0) {
                    //context.font = this.configuration.font;
                    this.context.fillStyle = this.configuration.colors.seleted;
                    this.context.fillText('+' + this.armiesToAdd[index], territory.center.x - 12, territory.center.y + 14);
                }
            }
        });
    }
}