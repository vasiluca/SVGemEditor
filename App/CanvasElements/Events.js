import { cache, drag, pressed } from '../Cache.js';

import { select } from './Selection.js';

import { svg } from './Modify/SVG.js';
import { editSVG } from './Modify/editSVG.js';
import { newSVG } from './Modify/newSVG.js';

import { tool } from '../Tab/Tool.js';

//** The idea is to separate out the user events, and UI state changes, from the rest of the code  */
/**
 * The UI is considered everything that does not have to do with the direct manipulation of the SVG
 * Document Canvas, but instead intends to reflect state or status changes to the user
 */

$(document).mousedown(function (e) {
	cache.start = [e.clientX, e.clientY];
	drag.start = [e.clientX, e.clientY];

	if (cache.press && tool.type != 'selection') { // when the user has an element tool selected
		newSVG.creating = true; // indicates that the user mouse-pressed down and might create an element by dragging
	}
}).mousemove(function (e) {
	// cache.stop points to the current cursor position on user's mousedown,
	// and it also points to the last position the cursor was in before the mouseup event
	cache.stop = [e.clientX, e.clientY];
	drag.end = [e.clientX, e.clientY];

	if (newSVG.creating) { // checks if the user mouse-pressed down with an element creation tool
		newSVG.creating = false;

		newSVG.create(tool.type);
	}
	if (cache.press && tool.type != 'selection') {
		editSVG.update(tool.type);
	}

	if (pressed.handle) {
		svg.resize();
	}
	if (pressed.element) {
		svg.move();
	}
});

$(document).mouseup(function () {
	// this enables the user to create a text element on a single click, even when they did not drag it
	if (newSVG.creating && tool.type == 'text') {
		newSVG.create(tool.type);
		editSVG.update(tool.type);
	}
	newSVG.creating = false; // Prevent the user from creating an element after they Click and then Mousemove
	select.area(cache.ele);

	cache.press = false;
	pressed.handle = false;
	pressed.element = false;
});