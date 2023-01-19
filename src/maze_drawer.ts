import p5 from "p5";
import { MazeBuilder, TileType } from "./maze_builder"

export class MazeDrawer {
    builder: MazeBuilder
    panel_size: number
    buffer: number
    border_outline: number
    // x_max: number
    // y_max: number
    finished: boolean

    pointer: number

    constructor(b: MazeBuilder, panel_size: number, outline: number = 10) {
        this.builder = b
        this.panel_size = panel_size
        this.border_outline = outline
        this.buffer = outline + panel_size / 2
        this.finished = false
        this.pointer = 0
    }

    init(p: p5) {
        p.rectMode(p.CENTER)
        p.fill(0, 255, 0)
        this.draw_box(p)
        p.fill(0, 0, 0)
    }

    draw(p: p5) {
        if (!this.finished) {
            // this.draw_maze(p)    // 一括病が
            this.draw_step(p)       // １マスずつ描画
        }
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

    /**
     * 迷路を一括で描画する
     * @param p p5オブジェクト
     */
    draw_maze(p: p5) {
        this.builder.floor.forEach((row, y_index) => {
            const line = row.map((f, x_index) => {
                this.draw_block(p, f, x_index, y_index)
            })
        });
    }

    /**
     * 生成済みの迷路を１マスずつ描画していく
     * @param p p5オブジェクト
     */
    draw_step(p: p5) {
        const point_x = this.pointer % this.builder.width
        const point_y = Math.floor(this.pointer / this.builder.width)

        if (point_y == this.builder.floor.length) {
            this.finished = true
            return
        }

        const f = this.builder.floor[point_y][point_x]
        this.draw_block(p, f, point_x, point_y)
        this.pointer++
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
