import p5 from "p5";
import { Maze, MazeBuilder, Point, TileType } from "./maze_builder"
import { FlagStartAndFinish } from "./stages/AbstractStage";
import { DrawStepStage } from "./stages/DrawStepStage";
import { PaintShortestPath } from "./stages/PaintShortestPath";
import { SearchWithBreadthFirst } from "./stages/SearchWithBreadthFirst";
import { StageFeeder } from "./stage_feeder";


export class MazeDrawer {
    maze: Maze
    // builder: MazeBuilder
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

    constructor(m: Maze, panel_size: number, outline: number = 10) {
        this.maze = m
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
        const draw_step = new DrawStepStage(p, this.panel_size)
        const run_draw_stage = draw_step.get_stage()

        // 左上から右下まで
        // const start = new Point(0, 0)
        // const finish = new Point(this.maze.width - 1, this.maze.height - 1)

        // 左下から右上まで
        const start = new Point(0, this.maze.height - 1)
        const finish = new Point(this.maze.width - 1, 0)

        const draw_flags = new FlagStartAndFinish(p, this.panel_size, this.border_outline, start, finish)
        const run_draw_flags = draw_flags.get_stage()

        // 幅優先探索ステージ
        const breadth_stage = new SearchWithBreadthFirst(p, this.panel_size, this.border_outline, start, finish, this.maze)
        const run_search_maze = breadth_stage.get_stage()

        const resolve = breadth_stage.resolve   // 解決配列を共有

        // リペイントステージ
        const repaint_stage = new PaintShortestPath(p, this.panel_size, this.border_outline, resolve, start, finish)
        const run_repaint = repaint_stage.get_stage()

        this.stages = new StageFeeder(this.maze,
            [
                // SimpleStage.run_stage
                run_draw_stage
                , run_draw_flags
                , run_search_maze
                , run_repaint
            ]
        )

    }

    draw(p: p5) {
        this.stages.run(p)
    }

    draw_box(p: p5) {
        const width = this.maze.width + 1
        const height = this.maze.height + 1
        p.fill(0, 0, 0)
        const x_background: number = width * this.panel_size + this.border_outline * 2
        const y_background: number = height * this.panel_size + this.border_outline * 2

        p.rect(x_background / 2, y_background / 2, x_background, y_background)
    }

}
