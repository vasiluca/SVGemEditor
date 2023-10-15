import { Element } from '../Element.js';

import { cache } from '../../../Cache.js';
import { newSVG } from '../../Main/newSVG.js';

class Line extends Element {
	#x1;
	#y1;
	#x2;
	#y2;

	constructor () {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	createAttr() {
     	var radius = Math.sqrt(Math.pow(cache.stop[0] - cache.start[0], 2) + Math.pow(cache.stop[1] - cache.start[1], 2));
		return {
			'x1': cache.start[0],
			'y1': cache.start[1],
			'x2': cache.stop[0],
			'y2': cache.stop[1]
		}
	}

	/**
	 * This will take an existing element and parse its attributes into this Object
	 * 
	 * @param {} ele 
	 */
	parseAttr(ele) {
		x1 = parseFloat(ele.attr('x1'));
		y1 = parseFloat(ele.attr('y1'));
    	x1 = parseFloat(ele.attr('x2'));
		y1 = parseFloat(ele.attr('y2'));
	}
}

export { Line }