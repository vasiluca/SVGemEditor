import { cache } from "../../Cache.js";

import { Opacityproperty } from "./Opacity.js";

$('[aria-label="opacity"]').mousedown(function() {
	cache.btnAction = 'opacity';
	console.log("opacity pressed");
})

$(document).mousemove(function(e) {
	if (cache.btnAction == 'opacity') {
		Opacityproperty.setOpacity();
	}
}).mouseup(function() {
	cache.btnAction = '';
})