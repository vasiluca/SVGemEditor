//** Test Selection and Move function (pass in to functions through parameters) */
import { cache, pressed } from "../Cache.js";

import { move } from "../../CanvasElements/Modify/Transform/Move.js";

import { select } from "./Selection.js";

function runtest(){
    test("Selection and Move Test", () => {
        /* Set initial position */
        var initialPosition = select.position(cache.ele);
        move(cache.ele);
        pressed.shiftkey = true;
        move(cache.ele);
        var newPosition = select.position(cache.ele);

        // Check if the position has changed after the move operation
        if (initialPosition.x === newPosition.x && initialPosition.y === newPosition.y) {
            throw new Error("The selected item is not moved properly");

    }
}