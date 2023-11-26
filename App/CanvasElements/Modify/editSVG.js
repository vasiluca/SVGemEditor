//** Deals strictly with direct changing attributes of elements or editing existing properties */

import { cache, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';

import { tool } from '../../Tab/Tool.js';

import { element } from './SVG.js';

var editSVG = {
	update(type) {
		let attr = element[type].createAttr(); // this will set the proper attributes based on the element type being created

		// after the element was created, we will also want to update certain attributes related to its property
		attr['stroke-width'] = tool.strokeWidth;
		attr.stroke = tool.stroke;

		if (type != 'line' && type != 'polyline') {
			attr['fill'] = tool.fill; // use the last color that was used for the fill color
			attr['paint-order'] = tool.paintOrder;
		}

		cache.ele.attr(attr);
	}
    
}

export { editSVG }