export default interface IAnimation {
    get finished(): boolean;
    update(delta: number): void;
    draw(context: CanvasRenderingContext2D): void;
}