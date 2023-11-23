import { Element } from '../Element.js';

import { cache, pressed } from '../../../Cache.js';

class Rectangle extends Element {
	constructor () {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var width = Math.abs(cache.stop[0] - cache.start[0]);
		var height = Math.abs(cache.stop[1] - cache.start[1]);
		var x = cache.start[0];
		var y = cache.start[1];

		if (pressed.shiftKey) {
			height = width;
		}

		if (height <= 0) {
			height = 0.1;
		}
		if (width <= 0) {
			width = 0.1;
		}

		// this accounts for if the user is drawing the Rectangle from bottom to top, or right to left
		var widthDiff = cache.stop[0] - cache.start[0];
		var heightDiff = cache.stop[1] - cache.start[1];
		widthDiff < 0 ? x = x - width : x = x;
		heightDiff < 0 ? y = y - height : y = y;
		
		if (pressed.cmdKey) {
			if (widthDiff > 0) {
				x -= width;
				width *= 2;
			}
			if (heightDiff > 0) {
				y -= height;
				height *= 2;
			}
			if (widthDiff < 0) {
				width *= 2;
			}
			if (heightDiff < 0) {
				height *= 2;
			}
		}

		return {
			'x': x,
			'y': y,
			'width': width,
			'height': height
		}
	}
}

export { Rectangle }