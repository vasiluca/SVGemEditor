import { cache, drag, pressed } from "../../../Cache.js";

import { doc } from "../../../SetUp.js";

import { svg, element } from "../SVG.js";
import { select } from "../../Selection.js";
import { editSVG } from "../editSVG.js";

var resize = function (initial, type) { initial = svg.initial; type = svg.type;
	cache.resizing = true;

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

	// calculate the original width and height before changes
	var width = rightX - leftX; 
	var height = bottomY - topY;

	var ratio = [1,1]; // this will store the ratio of the element for shift Key Press

	var axis = '';

	if (pressed.shiftKey) {
		translateX *= ratioX;
		translateY *= ratioY;
	}


	if (rightHandle) {
		rightX = drag.end[0] / initial.globalScale[0];
		axis += 'x';
	}
	if (bottomHandle) {
		bottomY = drag.end[1] / initial.globalScale[1];
		axis += 'y';
	}


	if (leftHandle) {
		leftX = drag.end[0] / initial.globalScale[0];
		axis += 'left';
	}
	if (topHandle) {
		topY = drag.end[1] / initial.globalScale[1];
		axis += 'top';
	}

	if (type === 'genericElement') {
		
		if (rightHandle) {
			translateX = (drag.end[0] - drag.start[0])*doc.viewScale[0];
		}
		if (bottomHandle) {
			translateY = (drag.end[1] - drag.start[1])*doc.viewScale[1];
		}


		if (leftHandle) {
			translateX = (drag.start[0] - drag.end[0])*doc.viewScale[0];
		}
		if (topHandle) {
			translateY = (drag.start[1] - drag.end[1])*doc.viewScale[1];
		}

		svg.new.translateDiff = [translateX * doc.zoom, translateY * doc.zoom];
	} else {
		drag.start = [leftX, topY];
		drag.end = [rightX, bottomY];


		if (pressed.shiftKey || pressed.cmdKey) {
			if (leftHandle) {
				drag.end[0] = leftX;
				drag.start[0] = rightX;
			}
			if (topHandle) {
				drag.end[1] = topY;
				drag.start[1] = bottomY;
			}
		}

		if (pressed.shiftKey) {
			ratio = [ratioX, ratioY];

			if (type == 'line') { // for some shapes it does matter whether they are drawn left-top to right-bottom or left-bottom to right-top
				var slope = svg.line.y1 / svg.line.y2;
				if (slope < 1) {

				} else {

				}
			}
		}

		if (type == 'line') {
			if (svg.line.x1 > svg.line.x2) {
				var temp = drag.start[0];
				drag.start[0] = drag.end[0];
				drag.end[0] = temp;
			}
			if (svg.line.y1 > svg.line.y2) {
				var temp = drag.start[1];
				drag.start[1] = drag.end[1];
				drag.end[1] = temp;
			}
		}

		cache.start = drag.start;
		cache.stop = drag.end;
		// need to re-center the cache.start to point to element center rather than top-left
		if (pressed.cmdKey) {
			if (axis.includes('x')) cache.start[0] += width / 2;
			if (axis.includes('y')) cache.start[1] += height / 2;
			if (axis.includes('left')) cache.start[0] -= width / 2;
			if (axis.includes('top')) cache.start[1] -= height / 2;
		}
	}


	editSVG.update(type, axis, ratio);
	// var attr = element[type].createAttr();

	// cache.ele.attr(attr);
	select.area(cache.ele);
}

export { resize }