
import { cache, pressed } from "../../../Cache"; 

var move = function(direction) {
	translateX = cache.stop[0] - cache.start[0];
	translateY = cache.stop[1] - cache.start[1];
	
	translateX = translateX/this.initial.scale[0]/doc.zoom;
	translateY = translateY/this.initial.scale[1]/doc.zoom;

	var transXabs = Math.abs(translateX);
	var transYabs = Math.abs(translateY);

	if ((pressed.shiftKey || pressed.cmdKey) && cache.dragDir == false) {
		translateX *= this.initial.scale[0];
		translateY *= this.initial.scale[1];
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

	switch (this.type) {
		case 'line':
			cache.ele.attr({
				'x1': (this.line.x1 + translateX),
				'x2': (this.line.x2 + translateX),
				'y1': (this.line.y1 + translateY),
				'y2': (this.line.y2 + translateY)
			});
			break;
		case 'rect':
			cache.ele.attr({
				'x': this.rect.x + translateX,
				'y': this.rect.y + translateY
			});
			break;
		case 'ellipse':
			cache.ele.attr({
				'cx': this.ellipse.cx + translateX,
				'cy': this.ellipse.cy + translateY
			});
			break;
		case 'circle':
			cache.ele.attr({
				'cx': this.circle.cx + translateX,
				'cy': this.circle.cy + translateY
			});
	}
	draw.selection(cache.ele);
	this.previewMove();
}

export { move }