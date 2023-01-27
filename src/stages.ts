import p5 from "p5";
import { MazeBuilder, TileType } from "./maze_builder";
import { Stage } from "./stage_feeder";

export class SimpleStage {
    static run_stage: Stage = (b: MazeBuilder, p: p5) => {
        console.log("run simple stage.")
        return true
    }

}

export class DrawStepStage {
    panel_pointer: number
    panel_size: number
    buffer: number
    border_outline: number

    constructor(panel_size: number, outline: number = 10) {
        this.panel_pointer = 0

        this.panel_size = panel_size
        this.border_outline = outline
        this.buffer = outline + panel_size / 2
        console.log(`pointer: ${this.panel_pointer}`)
    }

    run_stage: Stage = (b: MazeBuilder, p: p5) => {
        console.log("run simple stage.")
        return true
    }

    get_run_stage(): Stage {
        return (builder: MazeBuilder, p: p5) => {
            console.log("draw step 1")
            console.log(`pointer: ${this.panel_pointer}`)
            const point_x = this.panel_pointer % builder.width
            const point_y = Math.floor(this.panel_pointer / builder.width)

            if (point_y == builder.floor.length) {
                // this.finished_draw_maze = true
                return true
            }
            console.log({ point_y })
            console.log({ point_x })
            console.log("draw step 2")
            const f = builder.floor[point_y][point_x]
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
    draw_step(builder: MazeBuilder, p: p5) {
        console.log("draw step 1")
        console.log(`pointer: ${this.panel_pointer}`)
        const point_x = this.panel_pointer % builder.width
        const point_y = Math.floor(this.panel_pointer / builder.width)

        if (point_y == builder.floor.length) {
            // this.finished_draw_maze = true
            return true
        }
        console.log({ point_y })
        console.log({ point_x })
        console.log("draw step 2")
        const f = builder.floor[point_y][point_x]
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