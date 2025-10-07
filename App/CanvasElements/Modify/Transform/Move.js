
import { cache, drag, pressed } from "../../../Cache.js";

import { doc } from "../../../SetUp.js";

import { svg, element } from "../SVG.js";
import { editSVG } from "../editSVG.js";

var move = function(initial, type) {
	var translateX = cache.stop[0] - cache.start[0];
	var translateY = cache.stop[1] - cache.start[1];
	// TODO: Have to address scaling transformations in the future (for resizing as well)
	translateX = translateX/initial.globalScale[0];
	translateY = translateY/initial.globalScale[1];

	var transXabs = Math.abs(translateX);
	var transYabs = Math.abs(translateY);

	if ((pressed.shiftKey || pressed.cmdKey) && cache.dragDir == false) {
		if (translateY/3 < translateX && translateY > translateX/3 ||
			translateY/3 > translateX && translateY < translateX/3) { // Dragging element diagnolly left-up or right-down
			translateY = translateX;
			if (pressed.cmdKey) {
				cache.dragDir = 'right-down';
			}
		} else if (-translateY/3 < translateX && -translateY > translateX/3 ||
					-translateY/3 > translateX && -translateY < translateX/3) { // Dragging the element diagnolly down-left or up-right
			translateY = -translateX;
			if (pressed.cmdKey) {
				cache.dragDir = 'up-right';
			}
		} else {
			if (transXabs > transYabs) { // Dragging the element up or down
				translateY = 0;
				if (pressed.cmdKey) {
					cache.dragDir = 'verti';
				}
			}
			if (transYabs > transXabs) { // Dragging the element left or right
				translateX = 0;
				if (pressed.cmdKey) {
					cache.dragDir = 'horiz';
				}	
			}
		}
	}
	
	if (pressed.cmdKey || pressed.altKey) {
		switch (cache.dragDir) {
			case 'right-down':
				translateY = translateX;
				break;
			case 'up-right':
				translateY = -translateX;
				break;
			case 'verti':
				translateY = 0;
				break;
			case 'horiz':
				translateX = 0;
				break;
		}
	} else {
		cache.dragDir = false;
	}

	if (type !== 'genericElement') { // generic elements simply have their translation updated
		drag.start = [initial.x + translateX, initial.y + translateY];
		drag.end = [initial.right + translateX, initial.bottom + translateY];
	}
	
	// The below drag approaches are only applicable if using getBoundingClientRect() - NOT recommended, as we have to counteract transformations, versus getBBox() which currently ignores them
	// drag.start = [(initial.x + translateX * doc.zoom - cache.canvas.x) / doc.zoom, (initial.y + translateY * doc.zoom - cache.canvas.y) / doc.zoom];
	// drag.end = [(initial.right + translateX * doc.zoom - cache.canvas.x) / doc.zoom, (initial.bottom + translateY * doc.zoom - cache.canvas.y) / doc.zoom];

	if (type == 'line') { // for some shapes it does matter whether they are drawn left-top to right-bottom or left-bottom to right-top
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
	svg.new.translateDiff = [translateX, translateY];

	editSVG.update(type);

	svg.previewMove(translateX, translateY);
}

export { move }