import { MazeBuilder } from "./maze_builder";
import { MazeDrawer } from "./maze_drawer";
// import { CONST } from "./constants";

import p5 from "p5";

const generate_sketch = (input_width: number, input_height: number, input_block: number) => {
    const BLOCK_SIZE = input_block
    const MAZE_X = input_width % 2 == 0 ? input_width + 1 : input_width
    const MAZE_Y = input_height % 2 == 0 ? input_height + 1 : input_height

    const BORDER_WIDTH = 20
    const canvas_width = BORDER_WIDTH + MAZE_X * BLOCK_SIZE
    const canvas_height = BORDER_WIDTH + MAZE_Y * BLOCK_SIZE

    const builder = new MazeBuilder(MAZE_X, MAZE_Y)
    builder.pile_driving()
    builder.make_maze()
    // builder.debug_print_maze()

    const drawer = new MazeDrawer(builder.get_maze(), BLOCK_SIZE)

    return (p: p5) => {

        p.setup = () => {
            p.createCanvas(canvas_width, canvas_height);
            drawer.init(p)
        };

        p.draw = () => {
            drawer.draw(p)
        };

    };
}

const get_value_as_number = (id: string): number => {
    const input = document.getElementById(id) as HTMLInputElement
    return parseInt(input.value)
}
const btn_run = document.getElementById("button_run") as HTMLInputElement
let instance: p5 | undefined = undefined;

btn_run.addEventListener('click', () => {
    // フォーカスを外す
    const ae = document.activeElement as HTMLInputElement
    if (ae) {
        ae.blur()
    }

    const maze_width = get_value_as_number("maze_width")
    const maze_height = get_value_as_number("maze_height")
    const boxsize = get_value_as_number("maze_boxsize")

    if (instance == undefined) {
        const sketch = generate_sketch(maze_width, maze_height, boxsize)
        instance = new p5(sketch);
        ae.value = 'stop'
    }
    else {
        instance.remove()
        instance.clear(1, 1, 1, 0)
        instance = undefined
        ae.value = 'run'
    }
})
