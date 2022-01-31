import type { ActionAttack, ActionSkip, Configuration } from "./game/types";
import Game from "./game/Game";
import IRenderer from "./IRenderer";
import IInput from "./IInput";

function wait(millis: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, millis));
}

export default class GameController {
    game!: Game;
    status!: HTMLDivElement;

    constructor(private readonly renderer: IRenderer, private readonly input: IInput) {
    }

    async start(configuration: Configuration) {
        this.game = new Game(configuration, this.input);
        this.status = document.getElementById("status") as HTMLDivElement;

        this.game.new();
        this.renderer.initialize(this.game);
        this.beginDraw();
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

    private gameIsRunning(): boolean {
        const winner = this.game.getWinner();
        if (winner) {
            this.status.innerHTML = `<span style="color: ${winner.color};"> Player ${winner.id}</span> wins the game!`;
            return false;
        }

        this.status.innerHTML = `Turn for: <span style="color: ${this.game.currentPlayer.color};"> Player ${this.game.currentPlayer.id}</span>`;
        return true;
    };

    private async gameStep() {
        if (!this.gameIsRunning()) return;

        const delay = this.game.currentPlayer.interactive ? 1000 : 200;
        const action = await this.game.currentPlayer.getAction();

        if ((action as ActionSkip).skip) {
            this.status.innerHTML = `<span style="color: ${this.game.currentPlayer.color};"> Player ${this.game.currentPlayer.id}</span> skips turn`;
            await wait(delay);
            this.status.innerHTML = `<span style="color: ${this.game.currentPlayer.color};"> Player ${this.game.currentPlayer.id}</span> adding armies`;
            const armies =this. game.beforeSkip();
            //renderer.armiesToAdd = armies;
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
        // this.status.innerHTML += `<br>to: ${movement.defender.id} (<span style="color: ${movement.defender.color};">Player ${movement.defender.player?.id}</span>)`;
        await this.renderer.showPoints({
            [movement.attacker.id]: movement.attack.value,
            [movement.defender.id]: movement.defense.value
        }, 500);
        // this.status.innerHTML += `<br><span style="color: ${movement.attacker.color};">${movement.attack.value}</span> vs. <span style="color: ${movement.defender.color};">${movement.defense.value}</span>`;
        // if (movement.attack.value > movement.defense.value) {
        //     this.status.innerHTML += `<br><span style="color: ${movement.attacker.color};">Player ${movement.attacker.player?.id}</span> wins!`;
        // } else {
        //     this.status.innerHTML += `<br><span style="color: ${movement.defender.color};">Player ${movement.defender.player?.id}</span> wins!`;
        // }

        await wait(Math.min(500, delay));
        this.game.apply(movement);
        this.game.board.resetState();
        this.gameStep();
    }
}