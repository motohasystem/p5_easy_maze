import p5 from "p5";


// export type TileType = typeof tileType[keyof typeof tileType]

export enum direction {
    north
    , east
    , south
    , west
}

export enum TileType {
    Board
    , Column
    , Wall
}

export const TileChar = [
    '_'  // TileType.Board: ''
    , 'C' // TileType.Column: ''
    , 'W' // TileType.Wall: ''
]

export class MazeBuilder {
    // static TileType = {
    //     Board: 'board'      // 床板
    //     , Column: 'column'    // 柱
    //     , Wall: 'wall'        // 壁
    // } as const


    width: number   // 迷路の幅のマス
    height: number  // 迷路の奥行きのマス
    floor: number[][]   // 二次元迷路の全体

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        // this.panel

        this.init()
    }

    // 迷路全体の配列を構築する
    init() {
        this.floor = []
        for (let j: number = 0; j < this.height; j++) {
            const row: number[] = []
            for (let i: number = 0; i < this.width; i++) {
                row.push(TileType.Board)
            }
            this.floor.push(row)
            // console.log(`${this.floor[j]}`)
        }
        console.log('initialized.')
    }

    // ひとマスおきに柱(1)を立てる
    pile_driving() {
        for (let j: number = 1; j < this.height; j += 2) {
            for (let i: number = 1; i < this.width; i += 2) {
                this.floor[j][i] = TileType.Column
            }
        }
        console.log('piles drivered.')
    }

    // すべての柱を倒して迷路を作る
    make_maze() {
        for (let y: number = 1; y <= this.height - 1; y += 2) {
            for (let x: number = 1; x <= this.width - 1; x += 2) {
                this.make_wall(x, y)
            }
        }
        console.log('made maze.')
    }

    // 指定した柱を倒して壁(2)を作る
    make_wall(x: number, y: number) {
        if (this.floor[y][x] != TileType.Column) {
            throw new Error(`${x}:${y}には柱がありません。(${this.floor[y][x]})`)
        }

        let wall_x: number
        let wall_y: number

        const compass_max = ((y) => {
            if (y > 0) {
                return 3
            }
            return 4
        })(y)

        do {
            const compass = Math.round(Math.random() * compass_max)   // 0: 9時, 1: 12時, 2: 3時, 4: 6時
            // console.log(`compass: ${compass}`)
            switch (compass) {
                case direction.north:
                    wall_x = x
                    wall_y = y + 1
                    break
                case direction.east:
                    wall_x = x + 1
                    wall_y = y
                    break
                case direction.south:
                    wall_x = x
                    wall_y = y - 1
                    break
                case direction.west:
                    wall_x = x - 1
                    wall_y = y
                    break
                default:
                    throw new Error(`コンパスがありえない方角を指しました(${compass})`)
            }
            // console.log(`x:${wall_x}: y:${wall_y}`)
        } while (this.floor[wall_y][wall_x] == TileType.Wall)   // 乱数の指す方角がすでに壁の場合はやり直し
        this.floor[wall_y][wall_x] = TileType.Wall
    }

    debug_print_maze() {
        this.floor.forEach(row => {
            const line = row.map((f) => {
                // return `${String(f).padStart(3, '0')}`
                return TileChar[f]
            })
            console.log(line.join(''))

        });
    }
}

class MazeDrawer {
    builder: MazeBuilder
    panel_size: number
    buffer: number
    border_outline: number
    // x_max: number
    // y_max: number

    constructor(b: MazeBuilder, panel_size: number, outline: number = 10) {
        this.builder = b
        this.panel_size = panel_size
        this.border_outline = outline
        this.buffer = outline + panel_size / 2
    }

    draw(p: p5) {
        p.rectMode(p.CENTER)
        p.fill(0, 255, 0)
        this.draw_box(p)
        p.fill(0, 0, 0)
        this.draw_maze(p)
    }

    draw_box(p: p5) {
        const width = this.builder.width + 1
        const height = this.builder.height + 1
        p.fill(0, 0, 0)
        const x_background: number = width * this.panel_size + this.border_outline * 2
        const y_background: number = height * this.panel_size + this.border_outline * 2

        // p.rect(x_background / 2, y_background / 2, x_background, y_background)
        // p.fill(0, 255, 0)
        p.rect(x_background / 2, y_background / 2, x_background, y_background)
        // p.rect(this.border_outline, this.border_outline, width * this.panel_size, height * this.panel_size)
        // p.rect(0, 0, width * this.panel_size, height * this.panel_size)
    }

    draw_maze(p: p5) {
        this.builder.floor.forEach((row, y_index) => {
            const line = row.map((f, x_index) => {
                this.draw_block(p, f, x_index, y_index)
            })
        });
    }

    draw_block(p: p5, f: number, x: number, y: number) {
        // console.log(`f:${f} x:${x} y:${y}`)
        switch (f) {
            case TileType.Board:
                p.fill(255, 255, 255)
                break
            case TileType.Column:
                p.fill(0, 0, 0)
                break
            case TileType.Wall:
                p.fill(0, 0, 255)
                break
        }
        const size = this.panel_size
        p.rect(this.buffer + x * size, this.buffer + y * size, size, size)
    }
}

const sketch = (p: p5) => {
    const BLOCK_SIZE = 50
    const BORDER_WIDTH = 20
    const MAZE_X = 11
    const MAZE_Y = 11
    const builder = new MazeBuilder(MAZE_X, MAZE_Y)

    let drawer: MazeDrawer

    p.setup = () => {
        const canvas_width = BORDER_WIDTH + MAZE_X * BLOCK_SIZE
        const canvas_height = BORDER_WIDTH + MAZE_Y * BLOCK_SIZE

        // p.createCanvas(canvas_width, canvas_height);
        console.log({ canvas_width })
        console.log({ canvas_height })
        p.createCanvas(canvas_width, canvas_height);

        builder.pile_driving()
        builder.make_maze()
        builder.debug_print_maze()

        drawer = new MazeDrawer(builder, 50)
    };

    p.draw = () => {
        p.background(220);
        p.ellipse(50, 50, 80, 80);

        drawer.draw(p)
    };

};

new p5(sketch);
