import type { ActionAttack, ActionSkip, Configuration } from "./game/types";
import Game from "./game/Game";
import GameRenderer from "./renderers/GameRenderer";
import CanvasInput from "./input/CanvasInput";

const configuration: Configuration = {
    width: 350,
    height: 630 ,
    hexagonSize: 30,
    numberOfAreas: 30,
    areaSizeVariance: 0.1,
    useDistortion: true,
    useCompactShapes: true,
    maxArmies: 10,
    initialArmies: 20,
    colors: {
        players: [ '#ef476f', '#ffd166', '#06d6a0', '#593837', '#2B59C3' ],
        disabled: '#2D3047',
        seleted: '#0C0F0A',
        line: '#0C0F0A',
        text: '#fffcf9',
        shadow: "#2D3047",
        bg: '#fffcf9'
    },
    font: '14px Verdana'
};

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const context = canvas.getContext("2d") as CanvasRenderingContext2D;

const input = new CanvasInput(context);
const game = new Game(configuration, input);
const renderer = new GameRenderer(game);

const status = document.getElementById("status") as HTMLDivElement;
const gameIsRunning = (): boolean => {
    const winner = game.getWinner();
    if (winner) {
        status.innerHTML = `<span style="color: ${winner.color};"> Player ${winner.id}</span> wins the game!`;
        return false;
    }

    status.innerHTML = `Turn for: <span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span>`;

    return true;
}

async function gameStep() {
    if (!gameIsRunning()) return;

    const delay = game.currentPlayer.interactive ? 1000 : 200;
    const action = await game.currentPlayer.getAction();
    if ((action as ActionSkip).skip) {
        status.innerHTML = `<span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span> skips turn`;
        setTimeout(async () => {
            status.innerHTML = `<span style="color: ${game.currentPlayer.color};"> Player ${game.currentPlayer.id}</span> adding armies`;
            await game.skip();
            await gameStep();
        }, delay);

        return;
    }

    const attack = action as ActionAttack;
    const movement = game.attact(attack.source, attack.target);
    attack.source.selected = true;
    attack.source.active = false;
    attack.target.selected = true;
    attack.target.active = false;
    status.innerHTML += `<br>to: ${movement.defender.id} (<span style="color: ${movement.defender.color};">Player ${movement.defender.player.id}</span>)`;
    setTimeout(() => {
        status.innerHTML += `<br><span style="color: ${movement.attacker.color};">${movement.attack.value}</span> vs. <span style="color: ${movement.defender.color};">${movement.defense.value}</span>`;
        if (movement.attack.value > movement.defense.value) {
            status.innerHTML += `<br><span style="color: ${movement.attacker.color};">Player ${movement.attacker.player.id}</span> wins!`;
        } else {
            status.innerHTML += `<br><span style="color: ${movement.defender.color};">Player ${movement.defender.player.id}</span> wins!`;
        }

        setTimeout(() => {
            game.apply(movement);
            game.board.resetState();
            gameStep();
        }, delay);
    }, delay);
}

const draw = () => {
    renderer.draw(context);
    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);

game.new();
await gameStep();