import type { ActionAttack, ActionSkip, Configuration } from "./game/types";
import Game from "./game/Game";
import IRenderer from "./IRenderer";
import IInput from "./IInput";
import Player from "./game/Player";
import { Logger, GameStart, TurnStart, AddArmies, Attack, Win } from "./logs";

function wait(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export default class GameController {
    game!: Game;
    status!: HTMLDivElement;
    startDate!: Date;
    looseDate: Date | undefined;
    winDate: Date | undefined;

    private sourceOffsetY: number = 0;

    get players(): Player[] {
        return this.game?.players ?? [];
    }

    get winner(): Player | undefined {
        return this.game?.getWinner();
    }

    get currentPlayerId(): number {
        return this.game?.currentPlayer?.id ?? -1;
    }

    constructor(private readonly renderer: IRenderer, private readonly input: IInput, private readonly logger: Logger) {
    }

    initialize(configuration: Configuration): void {
        this.game = new Game(configuration, this.input);
        this.status = document.getElementById("status") as HTMLDivElement;

        this.renderer.initialize(this.game);
        this.beginDraw();
        this.sourceOffsetY = configuration.offsetY;
    }

    async start(): Promise<void> {
        this.game.new();

        // fix Y offset
        const minY = Math.min(...this.game.board.territories.map(t => Math.min(...t.outline.map(p => p.y))));
        this.game.configuration.offsetY = this.sourceOffsetY - minY;

        this.renderer.initializeTerritories();
        this.startDate = new Date();
        await this.logger({
            state: 'game',
            players: this.game.players.map(p => ({ id: p.id, name: p.interactive ? 'You' : 'CPU', color: p.color })),
            territories: this.game.board.territories.map(t => ({ playerId: t.player?.id, armies: t.armies, outlines: t.outline })),
            date: new Date()
        } as GameStart);
        await this.gameStep();
    }

    private beginDraw(): void {
        const renderer = this.renderer;
        const draw = () => {
            renderer.draw();
            window.requestAnimationFrame(draw);
        };
        draw();
    }

    private async gameIsRunning(): Promise<boolean> {
        const winner = this.game.getWinner();
        if (winner) {
            if (!this.winDate) this.winDate = new Date();
            await this.logger({
                state: 'win',
                playerId: winner.id,
                date: new Date()
            } as Win);

            return false;
        }

        const humanHasLost = this.game.players.findIndex(x => x.territories.length === 0 && x.interactive) >= 0;
        if (humanHasLost && !this.looseDate) {
            this.looseDate = new Date();
        }

        await this.logger({
            state: 'turn',
            playerId: this.game.currentPlayer.id,
            date: new Date()
        } as TurnStart);

        return true;
    };

    private async gameStep(): Promise<void> {
        if (!this.gameIsRunning()) return;

        const delay = this.game.currentPlayer.interactive ? 1000 : 200;
        const action = await this.game.currentPlayer.getAction();
        if ((action as ActionSkip).skip) {
            const armies = this. game.beforeSkip();
            const total = armies.reduce((a, b) => a + b, 0);
            const territories = armies.map((armies, i) => ({ territoryId: i, armies }));
            await this.logger({
                state: 'armies',
                playerId: this.game.currentPlayer.id,
                total,
                territories,
                date: new Date()
            } as AddArmies);

            this.game.board.disableAll();
            this.game.currentPlayer.territories.forEach(territory => territory.active = true);

            const promises: Promise<void>[] = [];
            this.game.currentPlayer.territories.forEach((t, i) => {
                if (armies[i] > 0) {
                    promises.push(this.renderer.addArmies(t.id, armies[i], Math.max(400, delay)));
                }
            });
            this.game.skip(armies);
            await Promise.all(promises);

            await wait(delay);
            this.game.board.resetState();
            this.gameStep();

            return;
        }

        const attack = action as ActionAttack;
        const movement = this.game.attact(attack.source, attack.target);
        attack.source.selected = true;
        attack.source.active = false;
        attack.target.selected = true;
        attack.target.active = false;

        await this.logger({
            state: 'attack',
            fromPlayerId: movement.attacker.player?.id,
            toPlayerId: movement.defender.player?.id,
            fromTerritoryId: movement.attacker.id,
            toTerritoryId: movement.defender.id,
            attack: movement.attack.value,
            defense: movement.defense.value,
            date: new Date()
        } as Attack);

        await this.renderer.showPoints({
            [movement.attacker.id]: movement.attack.value,
            [movement.defender.id]: movement.defense.value
        }, 500);

        await wait(Math.min(500, delay));
        this.game.apply(movement);
        this.game.board.resetState();
        this.gameStep();
    }
}