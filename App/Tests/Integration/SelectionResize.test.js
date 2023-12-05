//** Test Selection and Resize function (pass in to functions through parameters) */
import { resize } from "../../CanvasElements/Modify/Transform/Resize.js";
import { cache, pressed } from "../Cache.js";

import { select } from "./Selection.js";

import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { editSVG } from "../../CanvasElements/Modify/editSVG.js";

function runtest(){
    
    test("Selection and Resize Test", () => {
        newSVG.create("rectangle");
        var area = select.area(cache.ele);
        
        cache.start = [0,0];
        cache.stop = [10,10];
        resize(cache.ele);

        pressed.shiftkey = true;
        cache.start = [0, 0];
        cache.stop = [20, 20];
        resize(cache.ele);

        var new_area = select.area(cache.ele);
        if (area == new_area){
            throw new Error("The selected item is not resized properly");
        }

    });
}
