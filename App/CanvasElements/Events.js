import { cache, drag, pressed, svgAction } from '../Cache.js';
import { doc } from '../SetUp.js';

import { select } from './Selection.js';

import { svg, getSVGTransform } from './Modify/SVG.js';
import { editSVG } from './Modify/editSVG.js';
import { newSVG } from './Modify/newSVG.js';

import { tool } from '../Tab/Tool.js';

import { layers } from '../Tab/Layer.js';

//** The idea is to separate out the user events, and UI state changes, from the rest of the code  */
/**
 * The UI is considered everything that does not have to do with the direct manipulation of the SVG
 * Document Canvas, but instead intends to reflect state or status changes to the user
 */

//TODO: Move zooming function to Events.js file
const editor = document.querySelector('#editor');
$(document).on('wheel', function() {
	cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y }; // getBoundingClientRect works on global viewport as opposed getBBox() which works with SVG container only
})

let viewBox = cache.viewBox;
let viewScale = cache.viewScale;
let parent;
let offset = cache.canvas;
$(document).mousedown(function (e) {
	viewBox = cache.viewBox;
	viewScale = cache.viewScale;

	svg.storeAttr();
	
	cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y }; // this helps ensure that after zooming the canvas coordinates are updated appropriately
	
	parent = cache.ele[0]?.parentElement;

	// while we could technically use getBoundingClientRect(), we would not know which element to get the bounding rect of, because it has to be nearest ancestor with a transform
	// unlike baseVal, getCTM() used to derive globalTrans does not account for viewport scaling caused by viewBox
	// we want to cancel out the doc.zoom effect on globalTrans, since globalTrans is operating within the internal coordinate system
	offset = { // we only set offset offset once, before transforming an element
		x: cache.canvas.x + svg.initial.globalTrans[0]*doc.zoom*cache.viewScale[0], 
		y: cache.canvas.y + svg.initial.globalTrans[1]*doc.zoom*cache.viewScale[1],
	};

	cache.start = [(e.clientX - offset.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - offset.y) / viewScale[1] / doc.zoom + viewBox[1]];
	drag.start = [(e.clientX - offset.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - offset.y) / viewScale[1] / doc.zoom + viewBox[1]];

	// console.log('start', drag.start);

	if (cache.press && tool.type != 'selection') { // when the user has an element tool selected
		newSVG.creating = true; // indicates that the user mouse-pressed down and might create an element by dragging
	}
}).mousemove(function (e) {
	// cache.stop points to the current cursor position on user's mousedown,
	// and it also points to the last position the cursor was in before the mouseup event
	cache.stop = [(e.clientX - offset.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - offset.y) / viewScale[1] / doc.zoom + viewBox[1]];
	drag.end = [(e.clientX - offset.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - offset.y) / viewScale[1] / doc.zoom + viewBox[1]];

	cache.cursor = [e.clientX, e.clientY];

	if (newSVG.creating) { // checks if the user mouse-pressed down with an element creation tool
		newSVG.creating = false;
		svgAction.created = true;

		newSVG.create(tool.type);
	}
	
	if (cache.ele) {
		if (cache.press && tool.type != 'selection') {
			editSVG.update(tool.type);
		}

		if (tool.name !== 'drag') {
			if (pressed.handle) {
				svg.resize();
			}
			if (pressed.element) {
				svg.move();
			}
		}
	}
});

$(document).mouseup(function () {
	// console.log('end', drag.end);
	// this enables the user to create a text element on a single click, even when they did not drag it
	if (newSVG.creating) {
		if (tool.type == 'text') {
			newSVG.create(tool.type);
			editSVG.update(tool.type);
		}
		layers.update();
		newSVG.creating = false; // Prevent the user from creating an element after they Click and finish Mousemove
	}
	if (svgAction.created)
		layers.update();
	
	select.area(cache.ele); // will auto-hide Selection Area when no element is selected (cache.ele would be false)
	
	cache.resizing = false;
});