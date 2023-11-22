import { cache, pressed } from '../Cache.js';

import { svg } from './Main/SVG.js'; // TODO: will be removed
import { editSVG } from './Main/editSVG.js';
import { newSVG } from './Main/newSVG.js';

import { tool } from '../Tab/Tool.js';
import { draw } from './Main/Draw.js'; // TODO: will be removed

//** The idea is to separate out the user events, and UI state changes, from the rest of the code  */
/**
 * The UI is considered everything that does not have to do with the direct manipulation of the SVG
 * Document Canvas, but instead intends to reflect state or status changes to the user
 */

$(document).mousedown(function(e) {
  if (cache.press && tool.type != 'selection') { // when the user has an element tool selected
      newSVG.creating = true; // indicates that the user mouse-pressed down and might create an element by dragging
  }
}).mousemove(function(e) {
	// cache.stop points to the current cursor position on user's mousedown,
	// and it also points to the last position the cursor was in before the mouseup event
	cache.stop = [e.clientX,e.clientY];

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

$(document).mouseup(function() {
  draw.selection(cache.ele);
  
  cache.press = false;
  pressed.handle = false;
  pressed.element = false;
});