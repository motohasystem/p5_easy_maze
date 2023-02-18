import { MazeBuilder } from "./maze_builder";
import { MazeDrawer } from "./maze_drawer";
// import { CONST } from "./constants";

import p5 from "p5";

const sketch = (p: p5) => {
    const BLOCK_SIZE = 20
    const MAZE_X = 8
    const MAZE_Y = 8

    // const BLOCK_SIZE = 24
    // const MAZE_X = 45
    // const MAZE_Y = 15

    // const BLOCK_SIZE = 24
    // const MAZE_X = 65
    // const MAZE_Y = 35

    // const BLOCK_SIZE = 12
    // const MAZE_X = 65
    // const MAZE_Y = 65

    // const BLOCK_SIZE = 6
    // const MAZE_X = 159
    // const MAZE_Y = 159

    const BORDER_WIDTH = 20

    let width = MAZE_X
    let height = MAZE_Y
    if (width % 2 == 0) {
        width++
    }
    if (height % 2 == 0) {
        height++
    }

    const builder = new MazeBuilder(width, height)

    let drawer: MazeDrawer

    p.setup = () => {
        const canvas_width = BORDER_WIDTH + width * BLOCK_SIZE
        const canvas_height = BORDER_WIDTH + height * BLOCK_SIZE

        // p.createCanvas(canvas_width, canvas_height);
        console.log({ canvas_width })
        console.log({ canvas_height })
        p.createCanvas(canvas_width, canvas_height);

        builder.pile_driving()
        builder.make_maze()
        builder.debug_print_maze()

        drawer = new MazeDrawer(builder.get_maze(), BLOCK_SIZE)
        drawer.init(p)
    };

    p.draw = () => {
        drawer.draw(p)
    };

};

new p5(sketch);
