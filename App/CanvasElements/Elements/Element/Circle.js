import { Element } from '../Element.js';

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
		var radius = Math.sqrt(Math.pow(cache.stop[0] - cache.start[0], 2) + Math.pow(cache.stop[1] - cache.start[1], 2));
		
		return {
			'cx': cache.start[0],
			'cy': cache.start[1],
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