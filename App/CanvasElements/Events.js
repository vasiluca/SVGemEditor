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
  if (cache.press && tool.type != 'selection') { // while the user is mouse pressing
      newSVG.create(tool.type);  
  }
}).mousemove(function(e) {
	// cache.stop points to the current cursor position on user's mousedown,
	// and it also points to the last position the cursor was in before the mouseup event
	cache.stop = [e.clientX,e.clientY];
    if (cache.press && tool.type != 'selection') { // while the user is mouse pressing
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
  if (newSVG.created) {
    draw.selection(cache.ele);
    newSVG.created = false;
  }
  
  cache.press = false;
  pressed.handle = false;
  pressed.element = false;
});