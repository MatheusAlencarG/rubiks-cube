declare module 'cubejs' {
  export default class Cube {
    constructor();
    static fromString(facelets: string): Cube;
    asString(): string;
    move(moves: string): Cube;
    isSolved(): boolean;
    toJSON(): { cp: number[]; co: number[]; ep: number[]; eo: number[]; center: number[] };
  }
}
