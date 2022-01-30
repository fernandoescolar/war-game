import type { Action } from "../game/types";
import { attack, skip } from "../game/Actions";
import Game from "../game/Game";
import Territory from "../game/Territory";

type PromiseResolver = (value: Action) => void;
type MouseEventHandler = (event: MouseEvent) => void;

export default class CanvasInput {
    private game: Game | undefined;
    private selected: Territory | null = null;

    constructor(private readonly context: CanvasRenderingContext2D) {
    }

    setGame(game: Game): void {
        this.game = game;
    }

    getAction(): Promise<Action> {
        const skip = document.getElementById('skip');

        let callback: MouseEventHandler;
        let skipCallback: MouseEventHandler;

        return new Promise((resolve: PromiseResolver) => {
            callback = this.canvasHandler(resolve);
            skipCallback = this.skipHandler(resolve);
            this.context.canvas.addEventListener('click', callback);
            skip?.addEventListener('click', skipCallback);
        }).finally(() => {
            this.context.canvas.removeEventListener('click', callback);
            skip?.removeEventListener('click', skipCallback);
            this.selected = null;
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
        const target = this.game?.board.territories.find(territory => this.context.isPointInPath(territory.path, x, y));

        if (!target || target === this.selected) {
            this.selected = null;
            this.game.board.resetState();
            return;
        }

        if (!this.selected) {
            if (target.player !== this.game.currentPlayer) return;

            this.game.board.selectAttackerTerritory(target);
            this.selected = target;
            this.log('<br>Attack from: ' + this.selected.id);
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