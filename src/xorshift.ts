export class Xorshift {
    private seed: number;

    constructor(seed: number) {
        this.seed = seed;
    }

    next(): number {
        let x = this.seed;
        x ^= x << 13;
        x ^= x >> 17;
        x ^= x << 5;
        this.seed = x;
        return (x >>> 0) / 0xFFFFFFFF;
    }
}