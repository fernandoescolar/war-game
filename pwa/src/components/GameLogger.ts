import type { Log, GameStart, TurnStart, Attack, AddArmies, Win } from "@/game/logs";
import { HistoryActions, mapActions } from "@/store";

export default class GameLogger {
    private currentGame!: GameStart;
    private actions!: HistoryActions;

    private get players(): { id: number, name: string, color: string }[] {
        return this.currentGame.players;
    }

    private get territories(): { playerId: number, armies: number, outlines: { x: number, y: number }[] }[] {
        return this.currentGame.territories;
    }

    constructor(private readonly element: HTMLElement) {
        this.actions = mapActions<HistoryActions>('history')
    }

    async loggger (log: Log): Promise<void> {

        const { state } = log
        switch(state)
        {
            case 'game':
                this.currentGame = log as GameStart
                this.actions.Reset()
                //this.element.innerHTML = this.getString(log)
                break
            case 'turn':
                this.element.innerHTML = this.getString(log)
                break;
            case 'attack':
                //this.element.innerHTML = this.getString(log)
                break
            case 'armies':
                this.element.innerHTML = this.getString(log)
                break
            case 'win':
                this.element.innerHTML = this.getString(log)
                break
        }
        this.actions.AddLog(log)
        const logString = this.getString(log, true)
        this.actions.AddLogString(logString)

        return Promise.resolve()
    }

    private getString(log: Log, withDate: boolean = false): string {
        const { state, date } = log
        let message = ''
        switch(state)
        {
            case 'game':
                message = 'Game started'
                break
            case 'turn':
                const t = log as TurnStart
                message = `Turn for: <span style="color: ${this.players[t.playerId].color};"> Player ${t.playerId}</span>`
                break;
            case 'attack':
                const a = log as Attack
                message = `attack from:<br /> ${a.fromTerritoryId} (<span style="color: ${this.players[a.fromPlayerId].color};">Player ${a.fromPlayerId}</span>) to: ${a.toTerritoryId} (<span style="color: ${this.players[a.toPlayerId].color};">Player ${a.toPlayerId}</span>)`;
                message += `<br><span style="color: ${this.players[a.fromPlayerId].color};">${a.attack}</span> vs. <span style="color: ${this.players[a.toPlayerId].color};">${a.defense}</span>`;
                if (a.attack > a.defense) {
                    message += `<br><span style="color: ${this.players[a.fromPlayerId].color};">Player ${a.fromPlayerId}</span> wins!`;
                } else {
                    message += `<br><span style="color: ${this.players[a.toPlayerId].color};">Player ${a.toPlayerId}</span> wins!`;
                }
                break
            case 'armies':
                const x = log as AddArmies
                message = `<span style="color: ${this.players[x.playerId].color};"> Player ${x.playerId}</span> adding armies`;
                break
            case 'win':
                const w = log as Win
                message = `<span style="color: ${this.players[w.playerId].color};"> Player ${w.playerId}</span> wins the game!`
                break
        }

        if (withDate) {
            const pad2 = (n: number) => n < 10 ? `0${n}` : n
            const dateString = `${pad2(date.getHours())}:${pad2(date.getMinutes())}:${pad2(date.getSeconds())}`
            message = `[${dateString}] ${message}`
        }

        return message
    }
}
