import p5 from "p5"
import { Maze, Point, TileType } from "../maze_builder"
import { AbstractStage } from "./AbstractStage"

// ひとマスずつ迷路を描画するステージ
export class DrawStepStage extends AbstractStage {
    panel_pointer: number
    // panel_size: number
    // buffer: number
    border_outline: number

    constructor(p: p5, panel_size: number, outline: number = 10) {
        super(p, panel_size, outline)
        this.panel_pointer = 0
        // console.log(`pointer: ${this.panel_pointer}`)
    }


    // Stage関数を返す
    get_stage() {
        return (m: Maze, p: p5) => {
            // console.log("draw step 1")
            // console.log(`pointer: ${this.panel_pointer}`)
            const point = new Point()
            point.x = this.panel_pointer % m.width
            point.y = Math.floor(this.panel_pointer / m.width)

            if (point.y == m.floor.length) {
                // this.finished_draw_maze = true
                return true
            }
            // console.log("draw step 2")
            const f = m.floor[point.y][point.x]
            // console.log("draw step 3")
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
        // console.log("draw step 1")
        // console.log(`pointer: ${this.panel_pointer}`)
        const point = new Point()
        point.x = this.panel_pointer % m.width
        point.y = Math.floor(this.panel_pointer / m.width)

        if (point.y == m.floor.length) {
            // this.finished_draw_maze = true
            return true
        }
        // console.log("draw step 2")
        const f = m.floor[point.y][point.x]
        // console.log("draw step 3")
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