import { Element, drag } from '../Element.js';

import { cache, pressed } from '../../../Cache.js';

import { svg } from '../../Modify/SVG.js';

class GenericElement extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr(axis) {
		var xDiff = drag.end[0] - drag.start[0];
		var yDiff = drag.end[1] - drag.start[1];

		xDiff = svg.new.translateDiff[0];
		yDiff = svg.new.translateDiff[1];
		
		const origX = svg.initial.translate[0];
		const origY = svg.initial.translate[1];
		
		const origScaleX = svg.initial.scale[0];
		const origScaleY = svg.initial.scale[1];

		let x = origX;
		let y = origY;

		let scaleX = origScaleX;
		let scaleY = origScaleY;

		let scale = '';
		if (cache.resizing) {
			function getTransformOrigin(el) {
				const origin = getComputedStyle(el).transformOrigin.split(" ");
				const bbox = el.getBBox();
				const x = origin[0].includes("%")
					? (parseFloat(origin[0]) / 100)  * bbox.width
					: parseFloat(origin[0]);
				const y = origin[1].includes("%")
					? (parseFloat(origin[1]) / 100) * bbox.width
					: parseFloat(origin[1]);
				return [x, y];
			}
			// const origin = getTransformOrigin(cache.ele[0]);
			const origin = svg.initial.origin;


			scaleX = (svg.initial.real.currWidth + svg.new.translateDiff[0]) / svg.initial.real.currWidth;
			scaleY = (svg.initial.real.currHeight + svg.new.translateDiff[1]) / svg.initial.real.currHeight;
			scale = `scale(${scaleX}, ${scaleY})`;

			let newX, newY;

			let right = svg.initial.right;
			let left = svg.initial.x;
			let bottom = svg.initial.bottom;
			let top = svg.initial.y;

			right -= origin[0];
			left -= origin[0];
			top -= origin[1];
			bottom -= origin[1];
			
			if (axis.includes('left'))
				newX = right * scaleX - right; // this will subtract the new scaled coordinate from the previous coordinate
			else
				newX = left * scaleX - left; // this will subtract the new scaled coordinate from the previous coordinate	
			
			if (axis.includes('top'))
				newY = bottom * scaleY - bottom;
			else
				newY = top * scaleY - top;
			
			x = origX - newX * svg.initial.scale[0];
			y = origY - newY * svg.initial.scale[1];
		} else { // when dragging an element
			x = origX + xDiff *scaleX;
			y = origY + yDiff *scaleY;
		}

		return {
			'transform': `translate(${x},${y}) ${scale} ${svg.initial.matrix}`,
			// 'transform-origin': '50% 50%' // TODO: Ensure all the transforms work for a different CSS origin other than 0 0 (technically transform-origin is not a valid SVG attribute - should be manipulated with CSS instead)
		}
	}

	static parseAttr(ele) {

	}
}

export { GenericElement }