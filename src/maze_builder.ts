
// export type TileType = typeof tileType[keyof typeof tileType]

export class Point {
    x: number
    y: number

    constructor(x: number = -1, y: number = -1) {
        this.x = x
        this.y = y
    }

    equal(p: Point): boolean {
        if (p.x != this.x || p.y != this.y) {
            return false
        }

        return true
    }
}

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

export class Maze {
    width: number   // 迷路の幅のマス
    height: number  // 迷路の奥行きのマス
    floor: number[][]   // 二次元迷路の全体

    constructor(width: number, height: number) {
        this.width = width
        this.height = height
        // this.floor = []
        this.init()
    }

    // 迷路全体の配列を構築する
    init(carpet = TileType.Board) {
        this.floor = []
        for (let j: number = 0; j < this.height; j++) {
            const row: number[] = []
            for (let i: number = 0; i < this.width; i++) {
                row.push(carpet)
            }
            this.floor.push(row)
            // console.log(`${this.floor[j]}`)
        }
        console.log('initialized.')
    }

    point(point: Point): number {
        if (point.y < 0 || point.y >= this.height) {
            return -1
        }

        if (point.x < 0 || point.x >= this.width) {
            return -1
        }

        // console.log(`${point.x}, ${point.y}`)
        return this.floor[point.y][point.x]
    }
}

export class MazeBuilder {
    maze: Maze      // 迷路情報

    constructor(width: number, height: number) {

        this.maze = new Maze(width, height)
        this.maze.init()
    }

    get_maze(): Maze {
        return this.maze
    }


    // ひとマスおきに柱(1)を立てる
    pile_driving() {
        for (let j: number = 1; j < this.maze.height; j += 2) {
            for (let i: number = 1; i < this.maze.width; i += 2) {
                this.maze.floor[j][i] = TileType.Column
            }
        }
        console.log('piles drivered.')
    }

    // すべての柱を倒して迷路を作る
    make_maze() {
        for (let y: number = 1; y <= this.maze.height - 1; y += 2) {
            for (let x: number = 1; x <= this.maze.width - 1; x += 2) {
                this.make_wall(x, y)
            }
        }
        console.log('made maze.')
    }

    // 指定した柱を倒して壁(2)を作る
    make_wall(x: number, y: number) {
        if (this.maze.floor[y][x] != TileType.Column) {
            throw new Error(`${x}:${y}には柱がありません。(${this.maze.floor[y][x]})`)
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
        } while (wall_y < this.maze.height
        && wall_x < this.maze.width
            && this.maze.floor[wall_y][wall_x] == TileType.Wall)   // 乱数の指す方角がすでに壁の場合はやり直し
        this.maze.floor[wall_y][wall_x] = TileType.Wall
    }

    debug_print_maze() {
        this.maze.floor.forEach(row => {
            const line = row.map((f) => {
                // return `${String(f).padStart(3, '0')}`
                return TileChar[f]
            })
            console.log(line.join(''))

        });
    }
}

