import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';

import { svg } from '../../Modify/SVG.js';

class GenericElement extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var xDiff = drag.end[0] - drag.start[0];
		var yDiff = drag.end[1] - drag.start[1];

		if (svg.new.translateDiff) {
			xDiff = svg.new.translateDiff[0];
			yDiff = svg.new.translateDiff[1];
		}
		
		const origX = svg.initial.translate[0];
		const origY = svg.initial.translate[1];
		
		const origScaleX = svg.initial.scale[0];
		const origScaleY = svg.initial.scale[1];

		let x = origX;
		let y = origY;

		let scaleX = origScaleX;
		let scaleY = origScaleY;

		if (cache.resizing) {
			
		} else {
			x = origX + xDiff;
			y = origY + yDiff;
		}
		
		return {
			'transform': `translate(${x},${y}) ${svg.initial.matrix}`
			// 'transform-origin': '50% 50%'
		}
	}

	static parseAttr(ele) {

	}
}

export { GenericElement }