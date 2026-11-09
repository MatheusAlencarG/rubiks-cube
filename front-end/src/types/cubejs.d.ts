declare module 'cubejs/lib/cube' {
  export default class Cube {
    constructor();
    static fromString(facelets: string): Cube;
    asString(): string;
    move(moves: string): Cube;
    isSolved(): boolean;
  }
}
