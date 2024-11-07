import p5 from "p5"
import { Maze, MazeBuilder } from "./maze_builder"

export type Stage = (m: Maze, p: p5) => boolean

export class StageFeeder {
    stage_pointer: number
    stages: Stage[]
    state_pause: boolean
    maze: Maze
    // builder: MazeBuilder

    constructor(m: Maze, stages: Stage[]) {
        this.stage_pointer = 0
        this.stages = stages
        this.state_pause = true    // trueのときは入力を待つ
        this.maze = m
    }

    run(p: p5) {
        if (this.state_pause) {
            // キー入力またはキャンバスのクリックまたはスマホ表示の際のタッチで次に進む
            if (p.keyIsPressed || p.mouseIsPressed || p.touches.length > 0) {
                console.log("Input detected.")
                this.state_pause = false
                p.keyIsPressed = false
            }
        }
        else {
            if (this.stages[this.stage_pointer] == undefined) {
                console.info("finished!")
                this.state_pause = true
            }
            else {
                this.state_pause = this.stages[this.stage_pointer](this.maze, p)
                // trueが帰っていればステージが終わっているので次に進める
                if (this.state_pause == true) {
                    console.log("next stage")
                    this.stage_pointer++
                }
            }

        }
    }

    pause(pause: boolean = !this.state_pause) {
        this.state_pause = pause
    }

    next() {
        if (this.stage_pointer < this.stages.length) {
            this.stage_pointer++
        }
    }

}

