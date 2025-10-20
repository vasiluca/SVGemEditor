
import { cache, drag, pressed } from "../Cache.js";

import { ui } from "../UI.js";

import { newSVG } from "./Modify/newSVG.js";
import { svg } from "./Modify/SVG.js";
import { select } from "./Selection.js";

import { tool } from "../Tab/Tool.js";
import { layers } from "../Tab/Layer.js";

// TODO: Include canvas support for multiple element selections

let editorPos;
let mouseStart;
let windowPress;
$('#editor, .selection').mousedown(function (e) {
	cache.mapKeysTo = 'canvas';
	cache.mousedown = true;
	
	if (pressed.altKey) {cache.press = true;} // let the user create a new element copy above current while pressing resize handle
	if (e.which == 1) { // Check for LEFT click, since mousedown triggers when right clicking as wells
		if (!$(e.target).is('.selection *') && tool.type != 'selection') {
			cache.press = true;
			$('.selection').css('display', 'none');
		} else if ($(e.target).is('.selection *')) {
			if (cache.ele) svg.storeAttr();
			pressed.handle = $(e.target).attr('class');
		} else if ($(e.target).is('.selection')) {
			if (cache.ele) svg.storeAttr();
			pressed.element = true;
		} else if (tool.name === 'selection') {
			// select.area();
			cache.ele = -1;
		}
		
		if ($(e.target).is('.selection')) {
			select.pointerEvents = 'none';
			select.ui();
		}

		if (tool.name == 'drag') {
			ui.cursor('grabbing');
		}
	}

	if (tool.type === 'selection' && !$(e.target).is('.selection, .selection *')) {
		// $('.selection').css('display', 'none');
	}

	if (tool.name === 'selection') {
		if ($(e.target).is('#editor *')) {
			cache.ele = $(e.target).attr('id');
			// create an ID for the selected element if none exists:
			// TODO: Consider avoiding automatic ID creation for imported elements when possible to reduce SVG clutter
			if (!cache.ele) {
				
				cache.ele = newSVG.numID;
				$(e.target).attr('id', newSVG.numID);
				newSVG.numID += 1; // per convention we must update the numID before its next use
			};
			// select.area(cache.ele);
			svg.storeAttr();
			tool.stroke = cache.ele.attr('stroke');
			tool.fill = cache.ele.attr('fill');
			// $('.layers #' + cache.svgID).addClass('selected');
		}
	}
})

$(document).mousemove(function(e) {
	if (select.pointerEvents === 'none') {
		select.pointerEvents = 'all';
		select.ui(); // apply pointer events
	}
		

	if (tool.name === 'drag' && windowPress) {
		// reset the checks used for element dragging and resizing, to prevent them after space up
		pressed.element = false;
		pressed.handle = false;
		// cache.press = false; // prevent de-selection of currently selected elements

		// we cannot actually use cache.canvas.x/y because it is specifically for the SVG elements being drawn  
		$('svg#editor').css({
			'transition': 'all 0s ease',        
			'left': editorPos[0] + (e.clientX - mouseStart[0]),
			'top': editorPos[1] + (e.clientY - mouseStart[1])

		})
	}
	if (!pressed.spaceBar) {
		mouseStart = [e.clientX, e.clientY]; // this will update starting mouse position until the moment the user pressed the spacebar to drag
	}
	// if (!cache.ele && cache.mousedown) {
	// 	select.area();
	// }
}).mousedown(function(e) {
	

	windowPress = true;

	editorPos = [Number.parseFloat($('#editor').css('left')), Number.parseFloat($('#editor').css('top'))]; 
	mouseStart = [e.clientX, e.clientY];
}).mouseup(function(e) {
	

	if (e.which == 1) { // on LEFT click only
		
		if (!cache.ele) {
			if (cache.press)
				select.area(false);

			cache.currGroupID.clear();
			
			// $('.layers #' + cache.svgID).addClass('selected');
		}
	}

	if (pressed.handle) {
		layers.update();
		pressed.handle = false;
	}

	windowPress = false;
	
	cache.mousedown = false;
	cache.press = false;
	pressed.element = false;
	
	// svg.updateAttributes();
	// $('.layers .all #' + cache.svgID).addClass('selected');
})