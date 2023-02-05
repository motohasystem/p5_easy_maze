import p5 from "p5";
import { CONST } from "../constants";
import { Maze, MazeBuilder, Point, TileType } from "../maze_builder";
import { Stage as StageFunc } from "../stage_feeder";

// 基底クラス
export class AbstractStage {
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
            console.log("run abstruct stage.")
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
    text(char: string, point: Point) {
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


    // 色パネルと文字を同時に書き込む
    mark(p: p5, char: string, point: Point, bgcolor: string) {
        this.draw_rect(p, point, bgcolor)
        this.text(char, point)
    }

}



// 指定したマスにスタートとゴールを描画する
export class FlagStartAndFinish extends AbstractStage {
    start: Point
    finish: Point

    constructor(p: p5, panel_size: number, outline: number, start: Point, finish: Point) {
        super(p, panel_size, outline)
        this.start = start
        this.finish = finish
    }

    get_stage(): StageFunc {
        return (m: Maze, p: p5) => {
            // this.text('S', this.start)
            // this.text('G', this.finish)
            this.mark(p, "S", this.start, CONST.COLOR_MARK)
            this.mark(p, "G", this.finish, CONST.COLOR_MARK)


            return true
        }
    }
}
