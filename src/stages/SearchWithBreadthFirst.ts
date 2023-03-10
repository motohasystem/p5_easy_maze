
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

        // 探索対象の座標を持つ（TileType.Board である前提）
        // const lookup: Point[] = [pointer]
        this.next_lkup = [pointer]
        let order = 0
        this.resolve.floor[pointer.y][pointer.x] = 0

        return (m: Maze, p: p5) => {
            console.log(`SearchWithBreadthFirst: ${this.next_lkup}`)

            // スタート地点まで探索できたら終了
            if (this.next_lkup.some((p: Point) => {
                return this.start.equal(p)
            })) {
                this.mark(p, "S", this.start, CONST.COLOR_MARK)
                return true
            }

            this.next_lkup = this.next_lkup.reduce((next: Point[], floor) => {
                order = this.resolve.point(floor)   // 足元に書いてある番号
                const dir: Point[] = this.lookup_direction(floor)   // 東西南北のうちTileType.Boardの座標配列を返す
                if (dir.length > 0) { // length == 0 のときは行き止まり
                    dir.forEach((point) => {
                        // 床番に+1した番号を書き込む
                        const drawing = order + 1
                        this.resolve.floor[point.y][point.x] = drawing
                        this.text(drawing.toString(), point)
                        next.push(point)
                    })
                    // next.concat(dir)
                    console.log(this.resolve.floor)
                }

                return next
            }, [])
            console.log(this.next_lkup)

            if (this.next_lkup.length == 0) {
                return true     // 探索終了
            }

            console.log(`continue: ${this.next_lkup}`)

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