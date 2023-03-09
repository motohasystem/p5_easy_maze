import p5 from "p5"
import { CONST } from "../constants"
import { Maze, Point, TileType } from "../maze_builder"
import { AbstractStage } from "./AbstractStage"

// ひとマスずつ迷路を描画するステージ
export class DrawStepStage extends AbstractStage {
    panel_pointer: number
    border_outline: number
    color_dict: string[]

    constructor(p: p5, panel_size: number, outline: number = 10) {
        super(p, panel_size, outline)
        this.panel_pointer = 0
        // console.log(`pointer: ${this.panel_pointer}`)

        this.color_dict = []
        this.color_dict[TileType.Board] = CONST.COLOR_TILE_BOARD
        this.color_dict[TileType.Column] = CONST.COLOR_TILE_COLUMN
        this.color_dict[TileType.Wall] = CONST.COLOR_TILE_WALL
    }


    // Stage関数を返す
    get_stage() {
        const point = new Point()
        let f
        return (m: Maze, p: p5) => {
            point.x = this.panel_pointer % m.width
            point.y = Math.floor(this.panel_pointer / m.width)

            // 終了条件
            if (point.y == m.floor.length) {
                return true
            }
            f = m.floor[point.y][point.x]
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
        this.draw_rect(p, point, this.color_dict[f])
    }

}