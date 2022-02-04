import type { Action } from "../game/types";
import { attack, skip } from "../game/Actions";
import Game from "../game/Game";
import Territory from "../game/Territory";
import IInput from "../IInput";
import CanvasRenderer from "./CanvasRenderer";

type PromiseResolver = (value: Action) => void;
type MouseEventHandler = (event: MouseEvent) => void;

export default class CanvasInput implements IInput {
    game!: Game;
    selected: Territory | null = null;

    constructor(private readonly renderer: CanvasRenderer, private readonly skip: HTMLElement) {
    }

    initialize(game: Game): void {
        this.game = game;
        this.skip.style.display = 'none';
    }

    getAction(): Promise<Action> {
        this.skip.style.display = 'block';

        let callback: MouseEventHandler;
        let skipCallback: MouseEventHandler;

        return new Promise((resolve: PromiseResolver) => {
            callback = this.canvasHandler(resolve);
            skipCallback = this.skipHandler(resolve);
            this.renderer.context.canvas.addEventListener('click', callback);
            this.skip.addEventListener('click', skipCallback);
        }).finally(() => {
            this.renderer.context.canvas.removeEventListener('click', callback);
            this.skip.removeEventListener('click', skipCallback);
            this.selected = null;
            this.skip.style.display = 'none';
        });
    }

    private canvasHandler(resolver: PromiseResolver): MouseEventHandler {
        return (event: MouseEvent) => {
            this.handleClick(event, resolver);
        };
    }

    private skipHandler(resolver: PromiseResolver): MouseEventHandler {
        return () => {
            resolver(skip());
        };
    }

    private handleClick(event: MouseEvent, resolver: PromiseResolver): void {
        if (!this.game) return;

        const x = event.offsetX;
        const y = event.offsetY;
        const targetRenderer = this.renderer.territories.find(territory => this.renderer.context.isPointInPath(territory.path, x, y));
        const target = targetRenderer ? targetRenderer.territory : null;
        if (!target || target === this.selected) {
            this.selected = null;
            this.game.board.resetState();
            return;
        }

        if (!this.selected) {
            if (target.player !== this.game.currentPlayer) return;
            if (target.armies <= 1) return;

            this.game.board.selectAttackerTerritory(target);
            this.selected = target;
            return;
        }

        if (!target.active) {
            return;
        }

        this.game.board.selectDefenderTerritory(target);

        resolver(attack(this.selected, target));
    }

    log(message: string): void {
        const status = document.getElementById('status');
        if (!status) return;

        status.innerHTML += message;
    }
}