import type { Configuration } from "../game/types";
import Board from "../game/Board";
import Game from "../game/Game";
import TerritoryRenderer from "./TerritoryRenderer";

export default class BoardRenderer {
    private territoryRenderer: TerritoryRenderer;

    private get board(): Board {
        return this.game.board;
    }

    private get configuration(): Configuration {
        return this.game.configuration;
    }

    constructor(private readonly game: Game) {
        this.territoryRenderer = new TerritoryRenderer(this.game.configuration);
    }

    draw(context: CanvasRenderingContext2D): void {
        context.clearRect(0, 0, this.configuration.width, this.configuration.height);
        this.drawFirstLayer(context);
        this.drawSecondLayer(context);
        this.drawThirdLayer(context);
    }

    private drawFirstLayer(context: CanvasRenderingContext2D): void {
        context.shadowOffsetY = 4;
        context.shadowBlur = 4;
        context.shadowColor = this.configuration.colors.shadow;
        this.board.territories.forEach(territory => this.territoryRenderer.drawFirstLayer(territory, context));
    }

    private drawSecondLayer(context: CanvasRenderingContext2D): void {
        context.shadowOffsetY = 0;
        context.shadowBlur = 0;
        context.shadowColor = "rgba(0, 0, 0, 0.0)";
        this.board.territories.forEach(territory => this.territoryRenderer.drawSecondLayer(territory, context));
    }

    private drawThirdLayer(context: CanvasRenderingContext2D): void {
        this.board.territories.forEach(territory => this.territoryRenderer.drawThirdLayer(territory, context));
    }
}