//** This provides the necessary functions to create an SVG element */

import { cache, pressed } from '../../Cache.js';

import { svg } from './SVG.js';

import { tool } from '../../Tab/Tool.js';

var draw = {
	//** This selection function adjusts the selection area over a selected SVG element */ */
	selection: function (ele) {

	},
	// if (tool.type != 'selection') {
	//   svg.selectionAreas[svg.numID - 1] = obj;
	// }

	//** For now try to focus on testing the existing functions */
	// TODO: Most important is to implement text, polyline, and polygon
	text: function () { },
	polyline: function () { // The function for creating a polyline element
	},
	polygon: function () { // The function for creating a polygon element
	},

	path: function () { // The function for creating a path element
		if (!svg.created) {
			svg.pathData = cache.ele.attr('d').split(' ');
		}
		svg.new('path', {
			d: "M " + cache.start[0] + "," + cache.start[1]
		});
	},
	brush: function () { }
}

export { draw }