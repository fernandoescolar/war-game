import type { Configuration, Movement } from "./types";
import DiceRoll from "./DiceRolling";
import Player from "./Player";
import Territory from "./Territory";
import Board from "./Board";
import HumanPlayer from "./HumanPlayer";
import CPUPlayer from "./CPUPlayer";
import CanvasInput from "../input/CanvasInput";
import SimpleAi from "../ai/SimpleAi";

export default class Game {
    players: Player[] = [];
    board: Board;
    currentPlayerIndex: number = 0;
    currentSuccessfullAttackMovements: number = 0;

    get currentPlayer(): Player {
        return this.players[this.currentPlayerIndex];
    }

    constructor(public configuration: Configuration, private readonly input: CanvasInput) {
        this.board = new Board(configuration);
        input.setGame(this);
    }

    new(): void {
        this.currentPlayerIndex = 0;
        this.players = this.createPlayers();
        this.shufflePlayers();

        this.board.new();
        this.board.assignTerritories(this.players);
        this.board.assignInitialArmies(this.players, this.configuration.initialArmies);
    }

    async skip(): Promise<void> {
        const armiesToAdd = Math.floor((this.currentSuccessfullAttackMovements + this.currentPlayer.territories.length) / 2);
        await this.board.assignPlayerArmies(this.currentPlayer, armiesToAdd, 200);
        this.currentSuccessfullAttackMovements = 0;
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
        if (this.currentPlayer.territories.length === 0) {
            this.skip();
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
            this.currentSuccessfullAttackMovements++;
            movement.defender.armies = movement.attacker.armies - 1;
            this.currentPlayer.setTerritory(movement.defender);
        }

        movement.attacker.armies = 1;
    }

    private createPlayers(): Player[] {
        return this.configuration.colors.players.map((color, index) =>
        index === 0 ? new HumanPlayer(index, color, this.input)
                    : new CPUPlayer(index, color, new SimpleAi(this)))
    }

    private shufflePlayers(): void {
        this.players.sort(() => Math.random() - 0.5);
        this.players.forEach((player, index) => player.id = index);
    }
}