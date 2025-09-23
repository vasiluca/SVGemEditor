import { cache, drag, pressed, svgAction } from '../Cache.js';
import { doc } from '../SetUp.js';

import { select } from './Selection.js';

import { svg } from './Modify/SVG.js';
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

$(document).mousedown(function (e) {
	cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y }; // this helps ensure that after zooming the canvas coordinates are updated appropriately

	const viewBox = cache.viewBox;
	const viewScale = cache.viewScale;
	cache.start = [(e.clientX - cache.canvas.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - cache.canvas.y) / viewScale[1] / doc.zoom + viewBox[1]];
	drag.start = [(e.clientX - cache.canvas.x) /viewScale[0] / doc.zoom + viewBox[0], (e.clientY - cache.canvas.y) / viewScale[1] / doc.zoom + viewBox[1]];

	if (cache.press && tool.type != 'selection') { // when the user has an element tool selected
		newSVG.creating = true; // indicates that the user mouse-pressed down and might create an element by dragging
	}
}).mousemove(function (e) {
	// cache.stop points to the current cursor position on user's mousedown,
	// and it also points to the last position the cursor was in before the mouseup event
	const viewBox = cache.viewBox;
	const viewScale = cache.viewScale;
	cache.stop = [(e.clientX - cache.canvas.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - cache.canvas.y) / viewScale[1] / doc.zoom + viewBox[1]];
	drag.end = [(e.clientX - cache.canvas.x) / viewScale[0] / doc.zoom + viewBox[0], (e.clientY - cache.canvas.y) / viewScale[1] / doc.zoom + viewBox[1]];
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
	// this enables the user to create a text element on a single click, even when they did not drag it
	if (newSVG.creating) {
		if (tool.type == 'text') {
			newSVG.create(tool.type);
			editSVG.update(tool.type);
		}
		newSVG.creating = false; // Prevent the user from creating an element after they Click and finish Mousemove
	}
	
	select.area(cache.ele); // will auto-hide Selection Area when no element is selected (cache.ele would be false)
	
	
});