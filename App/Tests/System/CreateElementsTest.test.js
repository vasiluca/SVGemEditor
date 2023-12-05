import { cache } from "../../Cache.js";
import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { svg } from "../../CanvasElements/Modify/SVG.js";

newSVG.create("rectangle", 0);
cache.start=[0,0];
cache.stop=[10,10];
svg.resize();
newSVG.create("circle", 1);
cache.start=[10,0];
cache.stop=[20,10];
svg.resize();
newSVG.create("line", 2);
cache.start=[20,0];
cache.stop=[30,10];
svg.resize(); 

if($('#editor')[0].attr('type')!="rectangle"){
    console.log("Element not correct type, test failed");
}
if($('#editor')[0].attr('type')!="circle"){
    console.log("Element not correct type, test failed");
}
if($('#editor')[0].attr('type')!="line"){
    console.log("Element not correct type, test failed");
}