import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';
import { newSVG } from '../../Modify/newSVG.js';

class Line extends Element {
	static #x1;
	static #y1;
	static #x2;
	static #y2;

	constructor () {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		return {
			'x1': drag.start[0],
			'y1': drag.start[1],
			'x2': drag.end[0],
			'y2': drag.end[1]
		}
	}

	/**
	 * This will take an existing element and parse its attributes into this Object
	 * 
	 * @param {} ele 
	 */
	static parseAttr(ele) {
		x1 = parseFloat(cache.ele.attr('x1'));
		y1 = parseFloat(cache.ele.attr('y1'));
    	x1 = parseFloat(cache.ele.attr('x2'));
		y1 = parseFloat(cache.ele.attr('y2'));
	}
}

export { Line }