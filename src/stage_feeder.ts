import p5 from "p5"
import { MazeBuilder } from "./maze_builder"

export type Stage = (b: MazeBuilder, p: p5) => boolean

export class StageFeeder {
    stage_pointer: number
    stages: Stage[]
    state_pause: boolean
    builder: MazeBuilder

    constructor(builder: MazeBuilder, stages: Stage[]) {
        this.stage_pointer = 0
        this.stages = stages
        this.state_pause = true    // trueのときは入力を待つ
        this.builder = builder
    }

    run(p: p5) {
        if (this.state_pause) {
            // キー入力を待って次に進む
            if (p.keyIsPressed) {
                console.log(p.keyCode)
                console.log("key is pressed.")
                this.state_pause = false
                p.keyIsPressed = false
            }
        }
        else {
            // console.log(this.stage_pointer)
            // console.log(this.builder)
            // console.log(this.stages)
            if (this.stages[this.stage_pointer] == undefined) {
                console.info("finished!")
                this.state_pause = true
            }
            else {
                this.state_pause = this.stages[this.stage_pointer](this.builder, p)
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

