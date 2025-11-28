import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';

class Path extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr(x, y) {
		// var x = drag.end[0] - drag.start[0];
		// var y = drag.end[1] - drag.start[1];
		// console.log(drag.end[0], drag.start[0]);
		// console.log(drag.end[1], drag.start[1]);

		return {
			'transform': `translate(${x},${y})`
		}
	}

	static parseAttr(ele) {
		
	}
}

export { Path }