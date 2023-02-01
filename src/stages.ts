import p5 from "p5";
import { Maze, MazeBuilder, TileType } from "./maze_builder";
import { Stage as StageFunc } from "./stage_feeder";

// 基底クラス
export class SimpleStage {
    panel_size: number
    border_outline: number
    buffer: number

    p: p5

    constructor(p: p5, size: number, outline: number) {
        this.panel_size = size
        this.border_outline = outline
        this.buffer = outline + size / 2
        this.p = p
    }

    // Stage関数を返すget_run_stage() を実装すること
    get_stage(): StageFunc {
        return (m: Maze, p: p5) => {
            console.log("run simple stage.")
            return true
        }
    }

    draw_char(char: string, x: number, y: number) {
        this.p.fill(255, 0, 50)
        this.p.textSize(this.panel_size * 0.8)
        this.p.textAlign(this.p.CENTER, this.p.CENTER)
        this.p.text(char, x, y)
    }
}

// 指定したマスにスタートとゴールを描画する
export class FlagStartAndFinish extends SimpleStage {
    sx: number
    sy: number
    fx: number
    fy: number

    constructor(p: p5, panel_size: number, outline: number, sx: number, sy: number, fx: number, fy: number) {
        super(p, panel_size, outline)

        this.sx = sx
        this.sy = sy
        this.fx = fx
        this.fy = fy
    }

    get_stage(): StageFunc {
        return (m: Maze, p: p5) => {
            const sx = this.sx * this.panel_size + this.buffer
            const sy = this.sy * this.panel_size + this.buffer
            // const fx = this.fx * this.panel_size + this.buffer
            // const fy = this.fy * this.panel_size + this.buffer
            const fx = (m.width - 1) * this.panel_size + this.buffer
            const fy = (m.height - 1) * this.panel_size + this.buffer

            this.draw_char('S', sx, sy)
            this.draw_char('G', fx, fy)

            return true
        }
    }

}
// draw_start_and_goal(p: p5, sx: num3er, sy: number, gx: number, gy: number) {


// 幅優先探索するステージ
// export class SearchWithBreadthFirst extends SimpleStage {
//     constructor()
//     get_stage(): StageFunc {
//         return (b: MazeBuilder, p: p5) => {
//             console.log("run simple stage.")
//             return true
//         }
//     }
// }


// ひとマスずつ迷路を描画するステージ
export class DrawStepStage extends SimpleStage {
    panel_pointer: number
    // panel_size: number
    // buffer: number
    border_outline: number

    constructor(p: p5, panel_size: number, outline: number = 10) {
        super(p, panel_size, outline)
        this.panel_pointer = 0

        // this.panel_size = panel_size
        // this.border_outline = outline
        // this.buffer = outline + panel_size / 2
        console.log(`pointer: ${this.panel_pointer}`)
    }

    // run_stage: Stage = (b: MazeBuilder, p: p5) => {
    //     console.log("run simple stage.")
    //     return true
    // }

    // Stage関数を返す
    get_stage() {
        return (m: Maze, p: p5) => {
            console.log("draw step 1")
            console.log(`pointer: ${this.panel_pointer}`)
            const point_x = this.panel_pointer % m.width
            const point_y = Math.floor(this.panel_pointer / m.width)

            if (point_y == m.floor.length) {
                // this.finished_draw_maze = true
                return true
            }
            console.log({ point_y })
            console.log({ point_x })
            console.log("draw step 2")
            const f = m.floor[point_y][point_x]
            console.log("draw step 3")
            this.draw_block(p, f, point_x, point_y)
            this.panel_pointer++

            return false

        }
    }

    /**
     * 生成済みの迷路を１マスずつ描画していく
     * @param p p5オブジェクト
     */
    draw_step(m: Maze, p: p5) {
        console.log("draw step 1")
        console.log(`pointer: ${this.panel_pointer}`)
        const point_x = this.panel_pointer % m.width
        const point_y = Math.floor(this.panel_pointer / m.width)

        if (point_y == m.floor.length) {
            // this.finished_draw_maze = true
            return true
        }
        console.log({ point_y })
        console.log({ point_x })
        console.log("draw step 2")
        const f = m.floor[point_y][point_x]
        console.log("draw step 3")
        this.draw_block(p, f, point_x, point_y)
        this.panel_pointer++

        return false
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