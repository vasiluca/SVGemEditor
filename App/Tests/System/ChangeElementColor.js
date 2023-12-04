import { cache } from "../../Cache.js";
import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { svg } from "../../CanvasElements/Modify/SVG.js";

newSVG.create(rectangle, 0);
cache.start=[0,0];
cache.stop=[10,10];
svg.resize();
if($('#editor')[0].attr('stroke')!="black"){
    console.log("Stroke color not black, test failed");
}
if($('#editor')[0].attr('fill')!="black"){
    console.log("Fill color not black, test failed");
}

$('#editor')[0].attr('fill') = "rgb(255, 0, 0)";


if($('#editor')[0].attr('fill')!="rgb(255, 0, 0)"){
    console.log("Fill color not red, test failed");
}
if($('#editor')[0].attr('stroke')!="black"){
    console.log("Stroke color not black, test failed");
}