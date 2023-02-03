import p5 from "p5";
import { Maze, MazeBuilder, Point, TileType } from "./maze_builder";
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

    /**
     * 迷路の座標を指定してキャラクタを描画する
     * @param char 
     * @param m
     * @param panel_x 
     * @param panel_y 
     */
    text(char: string, m: Maze, point: Point) {
        const start = new Point()
        start.x = point.x * this.panel_size + this.buffer
        start.y = point.y * this.panel_size + this.buffer

        this.draw_char(char, start)
    }

    /**
     * キャンバスの座標を指定してキャラクタを描画する
     * @param char 
     * @param x 
     * @param y 
     */
    draw_char(char: string, point: Point, color: string = '#990033') {
        this.p.fill(color)
        this.p.textSize(this.panel_size * 0.8)
        this.p.textAlign(this.p.CENTER, this.p.CENTER)
        this.p.text(char, point.x, point.y)
    }


    /**
     * 迷路の座標を指定してブロックを描画する
     * @param p 
     * @param x 
     * @param y 
     * @param color 
     */
    draw_rect(p: p5, point: Point, color: string) {
        const size = this.panel_size
        p.fill(color)
        p.rect(this.buffer + point.x * size, this.buffer + point.y * size, size, size)
    }
}



// 指定したマスにスタートとゴールを描画する
export class FlagStartAndFinish extends SimpleStage {
    start: Point
    finish: Point

    constructor(p: p5, panel_size: number, outline: number, start: Point, finish: Point) {
        super(p, panel_size, outline)
        this.start = start
        this.finish = finish
    }

    get_stage(): StageFunc {
        return (m: Maze, p: p5) => {
            this.text('S', m, this.start)
            this.text('G', m, this.finish)

            return true
        }
    }
}

// ひとマスずつ迷路を描画するステージ
export class DrawStepStage extends SimpleStage {
    panel_pointer: number
    // panel_size: number
    // buffer: number
    border_outline: number

    constructor(p: p5, panel_size: number, outline: number = 10) {
        super(p, panel_size, outline)
        this.panel_pointer = 0
        console.log(`pointer: ${this.panel_pointer}`)
    }


    // Stage関数を返す
    get_stage() {
        return (m: Maze, p: p5) => {
            console.log("draw step 1")
            console.log(`pointer: ${this.panel_pointer}`)
            const point = new Point()
            point.x = this.panel_pointer % m.width
            point.y = Math.floor(this.panel_pointer / m.width)

            if (point.y == m.floor.length) {
                // this.finished_draw_maze = true
                return true
            }
            console.log("draw step 2")
            const f = m.floor[point.y][point.x]
            console.log("draw step 3")
            this.draw_block(p, f, point)
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
        const point = new Point()
        point.x = this.panel_pointer % m.width
        point.y = Math.floor(this.panel_pointer / m.width)

        if (point.y == m.floor.length) {
            // this.finished_draw_maze = true
            return true
        }
        console.log("draw step 2")
        const f = m.floor[point.y][point.x]
        console.log("draw step 3")
        this.draw_block(p, f, point)
        this.panel_pointer++

        return false
    }

    // https://colordrop.io/
    // ルート探索時の塗りつぶしを #a1bad0 で塗る
    draw_block(p: p5, f: number, point: Point) {
        // console.log(`f:${f} x:${x} y:${y}`)
        let color
        switch (f) {
            case TileType.Board:
                color = '#f3e8d6'
                break
            case TileType.Column:
                color = '#d0a727'
                break
            case TileType.Wall:
                color = '#667572'
                break
        }
        this.draw_rect(p, point, color)
    }

}