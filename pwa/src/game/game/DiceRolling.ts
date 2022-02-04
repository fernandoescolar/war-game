import Random from "./random-map/Random";

export default class DiceRoll {
    values: number[] = [];

    get value(): number {
        return this.values.reduce((a, b) => a + b, 0)
    }

    constructor(private numberOfDices: number) {
        this.values = this.roll();
    }

    roll(): number[] {
        const result: number[] = [];
        for (let i = 0; i < this.numberOfDices; i++) {
            result.push(Random.next(1, 6));
        }
        return result;
    }
}