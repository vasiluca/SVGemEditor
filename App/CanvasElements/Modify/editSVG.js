//** Deals strictly with direct changing attributes of elements or editing existing properties */

import { cache, drag, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';

import { tool } from '../../Tab/Tool.js';

import { element } from './SVG.js'; // Includes simple key-object pair for each element name

var editSVG = {
	update(type) {
		// Unless an element is dragged (pressed), calculate new size when resizing
		if (!pressed.element) {
			var xDiff = cache.stop[0] - cache.start[0];
			var yDiff = cache.stop[1] - cache.start[1];
			

			if (pressed.shiftKey) {
				if (cache.stop[1] < cache.start[1]) {
					drag.end[1] = cache.start[1] - Math.abs(xDiff);
				} else {
					drag.end[1] = cache.start[1] + Math.abs(xDiff);
				}
				// re-calculate xDiff and yDiff to account for shifKey
				xDiff = drag.end[0] - cache.start[0];
				yDiff = drag.end[1] - cache.start[1];
			}
			
			if (pressed.cmdKey) {
				drag.start[0] = cache.start[0] - xDiff;
				drag.start[1] = cache.start[1] - yDiff;
			} else { // have to reset drag.start back to its original start position
				drag.start[0] = cache.start[0];
				drag.start[1] = cache.start[1];
			}

		}
		let attr = element[type].createAttr(); // this will set the proper attributes based on the element type being created
		cache.ele.attr(attr);
	},
	attrDefaults(type) {
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

export { editSVG }