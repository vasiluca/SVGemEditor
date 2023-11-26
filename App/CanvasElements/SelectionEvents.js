
import { cache, pressed } from "../Cache.js";

import { ui } from "../UI.js";

import { svg } from "./Modify/SVG.js";
import { select } from "./Selection.js";

import { tool } from "../Tab/Tool.js";


$('#editor, .selection').mousedown(function (e) {
	if (e.which == 1) {
		cache.start = [e.clientX, e.clientY];
		if (!$(e.target).is('.selection *') && tool.type != 'selection') {
			$('.selection').css('display', 'none');
			cache.press = true;
		} else if ($(e.target).is('.selection *')) {
			svg.storeAttr();
			pressed.handle = $(e.target).attr('class');
		} else if ($(e.target).is('.selection')) {
			svg.storeAttr();
			pressed.element = true;
		} else {
			cache.press = true;
			ui.resizeHandles(true);
			select.area();
		}

		if (tool.name == 'drag') {
			ui.cursor('grabbing');
		}
	}

	if (tool.type == 'selection' && !$(e.target).is('.selection, .selection *')) {
		ui.resizeHandles(false);
	}

}).mouseup(function(e) {
	if (tool.type == 'selection' && cache.press) {
		$('.selection').css('display', 'none');
	} else {
		$('.selection').css('display', 'block');
		ui.resizeHandles(true);
		select.area(cache.ele);
	}

	if (pressed.handle) {
		select.area(cache.ele);
		layers.update();
	}
}).click(function (e) {
	if (tool.type == 'selection') {
		if ($(e.target).is('#editor *')) {
			cache.ele = $(e.target).attr('id');
			select.area(cache.ele);
			ui.resizeHandles(true);
			svg.storeAttr();
			$('.selection').css('display', 'block');
			tool.stroke = cache.ele.attr('stroke');
			$('.layers #' + cache.ele).addClass('selected');
		}
	}
});
