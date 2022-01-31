import type { ActionAttack, ActionSkip, Configuration } from "./game/types";
import Game from "./game/Game";
import IRenderer from "./IRenderer";
import IInput from "./IInput";

export default class GameController {

    constructor(private readonly renderer: IRenderer, private readonly input: IInput) {
    }

    async start(configuration: Configuration) {
        const game = new Game(configuration, this.input);
        const status = document.getElementById("status") as HTMLDivElement;
        const gameIsRunning = (): boolean => {
            const winner = game.getWinner();
            if (winner) {
                status.innerHTML = `<span style="color: ${winner.color};"> Player ${winner.id}</span> wins the game!`;
                return false;
            }

            status.innerHTML = `Turn for: <span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span>`;

            return true;
        };

        const renderer = this.renderer;
        async function gameStep() {
            if (!gameIsRunning()) return;

            const delay = game.currentPlayer.interactive ? 1000 : 200;
            const action = await game.currentPlayer.getAction();

            if ((action as ActionSkip).skip) {
                status.innerHTML = `<span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span> skips turn`;
                setTimeout(() => {
                    status.innerHTML = `<span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span> adding armies`;
                    const armies = game.beforeSkip();
                    //renderer.armiesToAdd = armies;
                    game.board.disableAll();
                    game.currentPlayer.territories.forEach(territory => territory.active = true);
                    game.currentPlayer.territories.forEach((t, i) => {
                        if (armies[i] > 0) {
                            renderer.addArmies(t.id, armies[i]);
                        }
                    });
                    setTimeout(() => {
                        game.skip(armies);
                        game.board.resetState();
                        gameStep();
                    }, delay * 1.5);
                }, delay);

                return;
            }

            const attack = action as ActionAttack;
            const movement = game.attact(attack.source, attack.target);
            attack.source.selected = true;
            attack.source.active = false;
            attack.target.selected = true;
            attack.target.active = false;
            status.innerHTML += `<br>to: ${movement.defender.id} (<span style="color: ${movement.defender.color};">Player ${movement.defender.player?.id}</span>)`;
            setTimeout(() => {
                status.innerHTML += `<br><span style="color: ${movement.attacker.color};">${movement.attack.value}</span> vs. <span style="color: ${movement.defender.color};">${movement.defense.value}</span>`;
                if (movement.attack.value > movement.defense.value) {
                    status.innerHTML += `<br><span style="color: ${movement.attacker.color};">Player ${movement.attacker.player?.id}</span> wins!`;
                } else {
                    status.innerHTML += `<br><span style="color: ${movement.defender.color};">Player ${movement.defender.player?.id}</span> wins!`;
                }

                setTimeout(() => {
                    game.apply(movement);
                    game.board.resetState();
                    gameStep();
                }, delay);
            }, delay);
        }

        const draw = () => {
            this.renderer.draw();
            window.requestAnimationFrame(draw);
        }

        window.requestAnimationFrame(draw);

        game.new();
        renderer.initialize(game);
        await gameStep();
    }
}