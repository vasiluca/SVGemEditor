import { cache } from "../../Cache.js";
var currid = cache.ele.attr('id');
cache.ele.remove();
for (let i = 0; i < $('#editor').length; i++) {
    if($('#editor')[i].attr('id')==currid){
        console.log("Element found, test failed");
    }
}