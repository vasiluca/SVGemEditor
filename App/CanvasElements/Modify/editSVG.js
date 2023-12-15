//** Deals strictly with direct changing attributes of elements or editing existing properties */

import { cache, drag, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';

import { tool } from '../../Tab/Tool.js';

import { element } from './SVG.js'; // Includes simple key-object pair for each element name

var editSVG = {
	update(type) {
		if (pressed.shiftKey && !pressed.selectionArea) {
			drag.end[1] = cache.start[1];
			if (cache.stop[1] < cache.start[1]) {
				drag.end[1] -= Math.abs(cache.stop[0] - cache.start[0]);
			} else {
				drag.end[1] += Math.abs(cache.stop[0] - cache.start[0]);
			}
		}
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