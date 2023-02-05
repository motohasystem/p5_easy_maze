import p5 from "p5"
import { Maze, Point, TileType } from "../maze_builder"
import { AbstractStage } from "./AbstractStage"
import { Stage as StageFunc } from "../stage_feeder";
import { CONST } from "../constants";


export class PaintShortestPath extends AbstractStage {
    start: Point
    finish: Point
    resolve: Maze

    constructor(p: p5, panel_size: number, outline: number, resolve: Maze, start: Point, finish: Point) {
        super(p, panel_size, outline)
        this.start = start
        this.finish = finish
        this.resolve = resolve
    }

    get_stage(): StageFunc {
        let foot_count
        let location = this.start

        return (m: Maze, p: p5) => {
            foot_count = this.resolve.point(location) - 1
            location = this.lookup_path(foot_count, location)
            if (location.equal(this.finish)) {
                this.mark(p, "G", location, CONST.COLOR_FINISHED)
                // this.mark(p, "G", location, "red")
                return true
            }

            this.mark(p, foot_count.toString(), location, CONST.COLOR_SEARCH_PATH)
            // this.mark(p, foot_count.toString(), location, "blue")
            return false
        }
    }

    // 次のパス座標を見つけて返す
    lookup_path(foot: number, loc: Point): Point {

        const north = new Point(loc.x, loc.y - 1)
        const south = new Point(loc.x, loc.y + 1)
        const east = new Point(loc.x + 1, loc.y)
        const west = new Point(loc.x - 1, loc.y)

        const north_count = this.resolve.point(north)
        const south_count = this.resolve.point(south)
        const east_count = this.resolve.point(east)
        const west_count = this.resolve.point(west)

        if (north_count == foot) {
            return north
        }

        if (south_count == foot) {
            return south
        }

        if (east_count == foot) {
            return east
        }

        if (west_count == foot) {
            return west
        }

        throw new Error(`次の数値 ${foot} が見つかりませんでした。`)
    }

}