//** Deals strictly with direct changing attributes of elements or editing existing properties */

import { cache, drag, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';

import { tool } from '../../Tab/Tool.js';

import { element, svg } from './SVG.js'; // Includes simple key-object pair for each element name

var editSVG = {
	update(type, axis, ratio) {
		if (!element[type])
			type = 'genericElement';
		// Unless an element is dragged (pressed), calculate new size when resizing
		if (!pressed.element && !pressed.ctrlKey && type !== 'genericElement') {
			if (!ratio) ratio = [1,1]; // set equal ratio for element if none provided (for element creation)
			if (!axis) axis = 'xy'; // assume element creation when no axis is provided

			var xDiff = cache.stop[0] - cache.start[0];
			var yDiff = cache.stop[1] - cache.start[1];

			if (pressed.shiftKey) {
				if (cache.stop[1] < cache.start[1]) {
					drag.end[1] = cache.start[1] - Math.abs(xDiff)*ratio[1];
					// if (axis.includes('top')) drag.end[1] = cache.stop[1] - Math.abs(yDiff) * ratio[1];
				} else {
					drag.end[1] = cache.start[1] + Math.abs(xDiff)*ratio[1];
					// if (axis.includes('top')) drag.end[1] = cache.stop[1] - Math.abs(yDiff) * ratio[1];
				}
				// re-calculate xDiff and yDiff to account for shifKey
				xDiff = drag.end[0] - cache.start[0];
				yDiff = drag.end[1] - cache.start[1];
			}
			
			if (pressed.cmdKey) {
				if (axis.includes('x')) drag.start[0] = cache.start[0] - xDiff;
				if (axis.includes('y')) drag.start[1] = cache.start[1] - yDiff;
				if (axis.includes('left')) drag.start[0] = cache.start[0] - xDiff;
				if (axis.includes('top')) drag.start[1] = cache.start[1] - yDiff;
				// if (axis.includes('left')) drag.end[0] = cache.stop[0] + xDiff;
				// if (axis.includes('top')) drag.end[1] = cache.stop[1] + yDiff;
			} else { // have to reset drag.start back to its original start position
				drag.start[0] = cache.start[0];
				drag.start[1] = cache.start[1];
			}

		}


		let attr = element[type] ? element[type].createAttr(axis) : {}; // this will set the proper attributes based on the element type being created
		cache.ele.attr(attr);
	},
	attrDefaults(type) {
		if (element[type]) {
			let attr = element[type].createAttr(); // this will set the proper attributes based on the element type being created

			// after the element was created, we will also want to update certain attributes related to its property
			if (type != 'text') { // Text should have no stroke border by default
				attr['stroke-width'] = tool.strokeWidth;
				attr.stroke = tool.stroke;
			}

			if (type != 'line' && type != 'polyline') {
				attr['fill'] = tool.fill; // use the last color that was used for the fill color
				attr['paint-order'] = tool.paintOrder;
			}

			cache.ele.attr(attr);
		}
	}
    
}

export { editSVG }