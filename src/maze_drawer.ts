import p5 from "p5";
import { MazeBuilder, TileType } from "./maze_builder"
import { DrawStepStage, SimpleStage } from "./stages";
import { StageFeeder } from "./stage_feeder";


export class MazeDrawer {
    builder: MazeBuilder
    panel_size: number
    buffer: number
    border_outline: number
    // x_max: number
    // y_max: number
    // finished_draw_maze: boolean // 迷路本体の描画が完了
    // finished_draw_quest: boolean     // 最短経路の探索が完了
    // finished_draw_root: boolean   // 探索結果の描画が完了

    pointer: number
    stages: StageFeeder

    constructor(b: MazeBuilder, panel_size: number, outline: number = 10) {
        this.builder = b
        this.panel_size = panel_size
        this.border_outline = outline
        this.buffer = outline + panel_size / 2
        // this.finished_draw_maze = false
        // this.finished_draw_quest = false
        // this.finished_draw_root = false
        this.pointer = 0

        console.log("drawer initialized.")
        console.log(this.pointer)
    }

    init(p: p5) {
        p.rectMode(p.CENTER)
        p.fill(0, 255, 0)
        this.draw_box(p)
        p.fill(0, 0, 0)

        // 迷路描画ステージ
        const draw_step = new DrawStepStage(this.panel_size)
        const run_draw_stage = draw_step.get_run_stage()

        this.stages = new StageFeeder(this.builder,
            [
                SimpleStage.run_stage
                , run_draw_stage
            ]
        )

    }

    draw(p: p5) {
        this.stages.run(p)

        // // 迷路の構築と描画
        // if (!this.finished_draw_maze) {
        //     // this.draw_maze(p)    // 一括描画
        //     this.draw_step(p)       // １マスずつ描画
        //     return
        // }

        // // 迷路の最短経路探索と描画

        // // 最短経路の描画
    }

    // 指定したマスにスタートとゴールを描画する
    // draw_start_and_goal(p: p5, sx: num3er, sy: number, gx: number, gy: number) {


    // }

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
    draw_step(builder: MazeBuilder, p: p5) {
        console.log("draw step 1")
        console.log(`pointer: ${this.pointer}`)
        const point_x = this.pointer % builder.width
        const point_y = Math.floor(this.pointer / builder.width)

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
        this.pointer++

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
