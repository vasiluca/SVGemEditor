//** Test Selection and Resize function (pass in to functions through parameters) */
import { resize } from "../../CanvasElements/Modify/Transform/Resize.js";
import { cache, pressed } from "../Cache.js";

import { select } from "./Selection.js";

import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { editSVG } from "../../CanvasElements/Modify/editSVG.js";

function runtest(){
    
    test("Selection and Resize Test", () => {
        var area = select.area(cache.ele);
        resize(cache.ele);
        pressed.shiftkey = true;
        resize(cache.ele);
        var new_area = select.area(cache.ele);
        if (area == new_area){
            throw new Error("The selected item is not resized properly");
        }

    });
}
