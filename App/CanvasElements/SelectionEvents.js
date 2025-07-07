
import { cache, drag, pressed } from "../Cache.js";

import { ui } from "../UI.js";

import { newSVG } from "./Modify/newSVG.js";
import { svg } from "./Modify/SVG.js";
import { select } from "./Selection.js";

import { tool } from "../Tab/Tool.js";
import { layers } from "../Tab/Layer.js";

// TODO: Include canvas support for multiple element selections

$('#editor, .selection').mousedown(function (e) {
	cache.mapKeysTo = 'canvas';
	cache.mousedown = true;
	
	if (pressed.altKey) {cache.press = true;} // let the user create a new element copy above current while pressing resize handle
	if (e.which == 1) { // Check for LEFT click, since mousedown triggers when right clicking as wells
		if (!$(e.target).is('.selection *') && tool.type != 'selection') {
			cache.press = true;
			$('.selection').css('display', 'none');
		} else if ($(e.target).is('.selection *')) {
			if (cache.ele) svg.storeAttr();
			pressed.handle = $(e.target).attr('class');
		} else if ($(e.target).is('.selection')) {
			if (cache.ele) svg.storeAttr();
			pressed.element = true;
		} else {
			// select.area();
			cache.svgID = -1;
		}

		if (tool.name == 'drag') {
			ui.cursor('grabbing');
		}
	}

	if (tool.type == 'selection' && !$(e.target).is('.selection, .selection *')) {
		$('.selection').css('display', 'none');
	}

	if (tool.type == 'selection') {
		if ($(e.target).is('#editor *')) {
			cache.ele = $(e.target).attr('id');
			// select.area(cache.ele);
			svg.storeAttr();
			tool.stroke = cache.ele.attr('stroke');
			tool.fill = cache.ele.attr('fill');
			// $('.layers #' + cache.svgID).addClass('selected');
		}
	}
})

$(document).mousemove(function() {
	if (!cache.ele && cache.mousedown) {
		select.area();
	}
}).mouseup(function(e) {
	if (e.which == 1) { // on LEFT click only
		if (!cache.ele && cache.press) {
			select.area(false);
			// $('.layers #' + cache.svgID).addClass('selected');
		}
	}

	if (pressed.handle) {
		layers.update();
		pressed.handle = false;
	}

	cache.mousedown = false;
	cache.press = false;
	pressed.element = false;
	// $('.layers #' + cache.svgID).addClass('selected');
})