import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';

class Circle extends Element {
	static #cx;
	static #cy;
	static #r;

	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var radius = Math.sqrt(Math.pow(drag.end[0] - drag.start[0], 2) + Math.pow(drag.end[1] - drag.start[1], 2));
		
		return {
			'cx': drag.start[0],
			'cy': drag.start[1],
			'r': radius
		}
	}

	static parseAttr(ele) {
		cx = parseFloat(ele.attr('cx'));
		cy = parseFloat(ele.attr('cy'));
    	r = parseFloat(ele.attr('rx'));
	}
}

export { Circle }