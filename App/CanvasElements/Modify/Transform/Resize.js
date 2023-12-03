import { cache, pressed } from "../../../Cache.js";

import { doc } from "../../../SetUp.js";

import { svg, element } from "../SVG.js";
import { select } from "../../Selection.js";

var resize = function (initial, type) { initial = svg.initial; type = svg.type;
	var selection = $('.selection')[0].getBoundingClientRect();
	var rightHandle = pressed.handle.includes('right'); // Check if a handle on the right is being pressed
	var bottomHandle = pressed.handle.includes('bottom'); // Check if a handle on the bottom is being pressed
	var topHandle = pressed.handle.includes('top');
	var leftHandle = pressed.handle.includes('left');
	var selectW, selectH;
	// These two lines for translations are only for compensating for Zoom on the Canvas
	var translateX = (selection.width - cache.origSelectArea.width) / initial.scale[0] / doc.zoom;
	var translateY = (selection.height - cache.origSelectArea.height) / initial.scale[1] / doc.zoom;
	// These ratios are for the use of when the shiftKey is pressed
	var ratioX = Math.abs(initial.width / initial.height);
	var ratioY = Math.abs(initial.height / initial.width);
	// Set the cache area for easily generating new element attribues
	var leftX = initial.x; 
	var rightX = initial.right;
	var topY = initial.y;
	var bottomY = initial.bottom;

	if (pressed.shiftKey) {
		translateX *= ratioX;
		translateY *= ratioY;
	}

	if (leftHandle) {
		selectW = rightX - cache.stop[0];
		if (selectW <= 0) selectW = 0;

		leftX = rightX - selectW;
	}

	if (rightHandle) {
		selectW = cache.stop[0] - leftX;
		if (selectW <= 0) selectW = 0;

		rightX = leftX + selectW;
	}


	if (topHandle) {
		selectH = bottomY - cache.stop[1];
		if (selectH <= 0) selectH = 0;

		topY = bottomY - selectH;
	}

	if (bottomHandle) {
		selectH = cache.stop[1] - topY;
		if (selectH <= 0) selectH = 0;

		bottomY = topY + selectH;
	}

	cache.start[0] = leftX;
	cache.stop[0] = rightX;

	cache.start[1] = topY;
	cache.stop[1] = bottomY;

	if (type == 'line') { // for some shapes it does matter whether they are drawn left-top to right-bottom or left-bottom to right-top
		if (svg.line.x1 > svg.line.x2) {
			var temp = cache.start[0];
			cache.start[0] = cache.stop[0];
			cache.stop[0] = temp;
		}
		if (svg.line.y1 > svg.line.y2) {
			var temp = cache.start[1];
			cache.start[1] = cache.stop[1];
			cache.stop[1] = temp;
		}
	}

	var attr = element[type].createAttr();

	cache.ele.attr(attr);
	select.area();
}

export { resize }