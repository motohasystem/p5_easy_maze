
// 幅優先探索でゴールからスタートを探索していき

import p5 from "p5"
import { CONST } from "../constants";
import { Maze, Point, TileType } from "../maze_builder"
import { AbstractStage } from "./AbstractStage"
import { Stage as StageFunc } from "../stage_feeder";

// スタートからゴールの順に最短経路を塗りつぶす
export class SearchWithBreadthFirst extends AbstractStage {
    start: Point
    finish: Point
    maze: Maze   // 迷路本体
    resolve: Maze // 探索結果を書き込む
    next_lkup: Point[]

    constructor(p: p5, panel_size: number, outline: number = 10, start: Point, finish: Point, maze: Maze) {
        super(p, panel_size, outline)
        this.start = start
        this.finish = finish

        // this.mark(p, "G", this.finish, CONST.COLOR_MARK)

        this.maze = maze
        this.resolve = new Maze(maze.width, maze.height)
        this.resolve.init(-1)    // -1を敷き詰めた配列を作成する
    }

    get_stage(): StageFunc {
        const pointer = new Point(this.finish.x, this.finish.y)
        this.next_lkup = [pointer]
        let order = 0
        this.resolve.floor[pointer.y][pointer.x] = 0

        return (m: Maze, p: p5) => {
            // console.log(`SearchWithBreadthFirst: ${this.next_lkup}`) // 不要なログは削除

            if (this.next_lkup.some((p: Point) => this.start.equal(p))) {
                this.mark(p, "S", this.start, CONST.COLOR_MARK)
                return true
            }

            const newNextLkup: Point[] = []
            for (const floor of this.next_lkup) {
                order = this.resolve.point(floor)
                const dir: Point[] = this.lookup_direction(floor)
                for (const point of dir) {
                    const drawing = order + 1
                    this.resolve.floor[point.y][point.x] = drawing
                    this.text(drawing.toString(), point)
                    newNextLkup.push(point)
                }
            }
            this.next_lkup = newNextLkup

            if (this.next_lkup.length == 0) {
                return true
            }

            // console.log(`continue: ${this.next_lkup}`) // 不要なログは削除

            return false
        }
    }

    lookup_direction(floor: Point) {
        const result: Point[] = []

        const north = new Point(floor.x, floor.y - 1)
        const south = new Point(floor.x, floor.y + 1)
        const east = new Point(floor.x + 1, floor.y)
        const west = new Point(floor.x - 1, floor.y)

        const north_tile = this.maze.point(north)
        const south_tile = this.maze.point(south)
        const east_tile = this.maze.point(east)
        const west_tile = this.maze.point(west)

        if (north_tile == TileType.Board && this.resolve.point(north) == -1) {
            result.push(north)
        }

        if (south_tile == TileType.Board && this.resolve.point(south) == -1) {
            result.push(south)
        }

        if (east_tile == TileType.Board && this.resolve.point(east) == -1) {
            result.push(east)
        }

        if (west_tile == TileType.Board && this.resolve.point(west) == -1) {
            result.push(west)
        }

        return result
    }

}