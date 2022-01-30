import Territory from "./Territory";
import type { Action, ActionAttack, ActionSkip } from "./types";

export function skip(): Action {
    return { skip: true } as ActionSkip;
}

export function attack(source: Territory, target: Territory): Action {
    return { source, target } as ActionAttack;
}