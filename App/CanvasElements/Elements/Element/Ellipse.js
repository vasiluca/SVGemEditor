import { Element } from '../Element.js';

import { cache, pressed } from '../../../Cache.js';

class Ellipse extends Element {
	constructor () {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var cx = cache.start[0];
		var cy = cache.start[1];
		var rx = Math.abs(cache.stop[0] - cache.start[0]);
		var xDiff = cache.stop[0] - cache.start[0];
		var ry = Math.abs(cache.stop[1] - cache.start[1]);
		var yDiff = cache.stop[1] - cache.start[1];

		if (pressed.shiftKey) {
			ry = rx; // both radiuses will be the same when shiftKey is pressed
		}

		if (rx <= 1) {
			rx = 1;
		}
		if (ry <= 1) {
			ry = 1;
		}

		if (pressed.cmdKey) {
			cx = cache.start[0];
			cy = cache.start[1];
		} else {
			if (xDiff > 0) {
				rx /= 2;
				cx += rx;
			}
			if (yDiff > 0) {
				ry /= 2;
				cy += ry;
			}
			if (xDiff < 0) {
				rx /= 2;
				cx -= rx;
			}
			if (yDiff < 0) {
				ry /= 2;
				cy -= ry;
			}
		}

		return {
			'cx': cx,
			'cy': cy,
			'rx': rx,
			'ry': ry
		}
	}
}

export { Ellipse }