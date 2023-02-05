import { MazeBuilder } from "./maze_builder";
import { MazeDrawer } from "./maze_drawer";

import p5 from "p5";

const sketch = (p: p5) => {
    const BLOCK_SIZE = 25
    const MAZE_X = 11
    const MAZE_Y = 11

    const BORDER_WIDTH = 20
    const builder = new MazeBuilder(MAZE_X, MAZE_Y)

    let drawer: MazeDrawer

    p.setup = () => {
        const canvas_width = BORDER_WIDTH + MAZE_X * BLOCK_SIZE
        const canvas_height = BORDER_WIDTH + MAZE_Y * BLOCK_SIZE

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
