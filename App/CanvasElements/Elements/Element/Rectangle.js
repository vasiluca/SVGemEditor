import { Element, drag } from '../Element.js';

import { cache, pressed } from '../../../Cache.js';

class Rectangle extends Element {
	constructor () {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var width = Math.abs(drag.end[0] - drag.start[0]);
		var height = Math.abs(drag.end[1] - drag.start[1]);
		var x = drag.start[0];
		var y = drag.start[1];

		if (height <= 0) {
			height = 0.1;
		}
		if (width <= 0) {
			width = 0.1;
		}

		// this accounts for if the user is drawing the Rectangle from bottom to top, or right to left
		var widthDiff = drag.end[0] - drag.start[0];
		var heightDiff = drag.end[1] - drag.start[1];
		widthDiff < 0 ? x = x - width : x = x;
		heightDiff < 0 ? y = y - height : y = y;

		return {
			'x': x,
			'y': y,
			'width': width,
			'height': height
		}
	}
}

export { Rectangle }