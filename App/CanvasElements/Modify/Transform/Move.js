
import { cache, pressed } from "../../../Cache.js";

import { doc } from "../../../SetUp.js";

import { svg } from "../SVG.js";

var move = function(initial, type) {
	var translateX = cache.stop[0] - cache.start[0];
	var translateY = cache.stop[1] - cache.start[1];
	
	translateX = translateX/initial.scale[0]/doc.zoom;
	translateY = translateY/initial.scale[1]/doc.zoom;

	var transXabs = Math.abs(translateX);
	var transYabs = Math.abs(translateY);

	if ((pressed.shiftKey || pressed.cmdKey) && cache.dragDir == false) {
		translateX *= initial.scale[0];
		translateY *= initial.scale[1];
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

	switch (type) {
		case 'line':
			cache.ele.attr({
				'x1': (svg.line.x1 + translateX),
				'x2': (svg.line.x2 + translateX),
				'y1': (svg.line.y1 + translateY),
				'y2': (svg.line.y2 + translateY)
			});
			break;
		case 'rect':
			cache.ele.attr({
				'x': svg.rect.x + translateX,
				'y': svg.rect.y + translateY
			});
			break;
		case 'ellipse':
			cache.ele.attr({
				'cx': svg.ellipse.cx + translateX,
				'cy': svg.ellipse.cy + translateY
			});
			break;
		case 'circle':
			cache.ele.attr({
				'cx': svg.circle.cx + translateX,
				'cy': svg.circle.cy + translateY
			});
	}
	svg.previewMove();
}

export { move }