
import { cache, drag, pressed } from "../Cache.js";

import { ui } from "../UI.js";

import { newSVG } from "./Modify/newSVG.js";
import { svg } from "./Modify/SVG.js";
import { select } from "./Selection.js";

import { tool } from "../Tab/Tool.js";
import { layers } from "../Tab/Layer.js";

$('#editor, .selection').mousedown(function (e) {
	cache.mapKeysTo = 'canvas';
	if (e.which == 1) { // Check for LEFT click, since mousedown triggers when right clicking as wells
		cache.press = true;
		if (!$(e.target).is('.selection *') && tool.type != 'selection') {
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
			$('.layers #' + cache.svgID).addClass('selected');
		}
	}
}).mousemove(function() {
	if (!cache.ele && cache.press) {
		select.area();
	}
}).mouseup(function(e) {
	if (!cache.ele && cache.press) {
		select.area(false); console.log('area should be false');
	}
	layers.update();
	cache.press = false;
	pressed.handle = false;
	pressed.element = false;
})