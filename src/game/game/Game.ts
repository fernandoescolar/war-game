import type { Configuration, Movement } from "./types";
import DiceRoll from "./DiceRolling";
import Player from "./Player";
import Territory from "./Territory";
import Board from "./Board";
import HumanPlayer from "./HumanPlayer";
import CPUPlayer from "./CPUPlayer";
import IInput from "../IInput";
import Ai from "../ai/Ai";
import SimpleAi from "../ai/SimpleAi";
import DefaultAi from "../ai/DefaultAi";
import BetterAi from "../ai/BetterAi";

export default class Game {
    players: Player[] = [];
    board: Board;
    currentPlayerIndex: number = 0;
    currentSuccessfulAttackMovements: number = 0;

    get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    constructor(public configuration: Configuration, private readonly input: IInput) {
        this.board = new Board(configuration);
        input.initialize(this);
    }

    new(): void {
        this.currentPlayerIndex = 0;
        this.players = this.createPlayers();
        this.assignPlayerColors();
        this.shufflePlayers();

        this.board.new();
        this.board.assignTerritories(this.players);
        this.board.assignInitialArmies(this.players, this.configuration.initialArmies, this.configuration.humanInitialArmies);
    }

    beforeSkip(): number[] {
        const armiesToAdd = Math.floor((this.currentSuccessfulAttackMovements + this.currentPlayer.territories.length) / 2);
        return this.board.createAssignArmiesOperation(this.currentPlayer, armiesToAdd);
    }

    skip(armiesToAdd: number[]): void {
        this.board.applyAssignArmiesOperation(this.currentPlayer, armiesToAdd);
        this.currentSuccessfulAttackMovements = 0;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        if (this.currentPlayer.territories.length === 0) {
            this.skip([]);
        }
    }

    getWinner(): Player | undefined {
        return this.players.find(player => player.territories.length === this.configuration.numberOfAreas);
    }

    attact(attacker: Territory, defender: Territory): Movement {
        if (attacker.armies <= 1) throw new Error("Not enough armies");
        if (attacker.player !== this.currentPlayer) throw new Error("Not your territory");
        if (defender.player === this.currentPlayer) throw new Error("Can't attack your own territory");
        if (attacker.neighbours.indexOf(defender) < 0) throw new Error("Can't attack a territory that is not adjacent");

        const attack = new DiceRoll(attacker.armies);
        const defense = new DiceRoll(defender.armies);
        return {
            attacker,
            defender,
            attack,
            defense
        };
    }

    apply(movement: Movement): void {
        if (movement.attack.value > movement.defense.value) {
            this.currentSuccessfulAttackMovements++;
            movement.defender.armies = movement.attacker.armies - 1;
            this.currentPlayer.successfulMoves++;
            this.currentPlayer.setTerritory(movement.defender);
        }

        movement.attacker.armies = 1;
    }

    private createPlayers(): Player[] {
        return Array(this.configuration.numberOfPlayers).fill(null).map((_, index) => {
            const color = this.configuration.colors.players[index];
            return index === 0 ? new HumanPlayer(index, color, this.input)
                            : new CPUPlayer(index, color, this.getAiPlayer(index));
        });
    }

    private assignPlayerColors(): void {
        const human = this.players[0];
        if (human.color !== this.configuration.humanPlayerColor) {
            const cpu = this.players.find(player => player.color === this.configuration.humanPlayerColor);
            if (!cpu) {
                return;
            }

            cpu.color = human.color;
            human.color = this.configuration.humanPlayerColor;
        }
    }

    private shufflePlayers(): void {
        if (this.configuration.humanPlayerAlwaysFirst) {
            return;
        }

        this.players.sort(() => Math.random() - 0.5);
        this.players.forEach((player, index) => player.id = index);
    }

    private getAiPlayer(index: number): Ai {
        switch (index) {
            case 1:
                return new SimpleAi(this);
            case 2:
                return new DefaultAi(this);
            default:
                return new BetterAi(this);
        }
    }
}