//** This file stores all data that is temporary, and needed only for the current application session */
/**
 * The cursor position on mousedown and mouseup events is made public through here
 * because it's not worth passing them as global parameters 
 */

import { tool } from './Tab/Tool.js';

import { layers } from './Tab/Layer.js';

var cache = {
	start: [],
	stop: [],
	press: false,
	svgID: 0, // this stores the currently select SVG ID
	set ele(val) {
		this.svgID = val;
	},
	get ele() {
		var element = $('#editor #' + this.svgID);

		if (element.length > 0) // this will check that an element exists matching that ID when queried [with jQuery]
			return element;

		return false; // return False when no element matching ID was found
	},
	set hoverEle(val) {
		this.hovering = val;
	},
	get hoverEle() {
		return $('#' + this.hovering);
	},
	btnAction: '', // will store the current button property being changed
	selectedElements: [],
	dragTab: false,
	mapKeysTo: 'selection'
}

var drag = {
	start: [],
	end: []
}

var pressed = {
	selectionArea: false, // This stores whether the user is mousing down on the selection area (i.e. for moving/dragging an element)
	handle: false, // This refers to the blue handlebars that can resize a selected element

	shiftKey: false,
	ctrlKey: false,
	altKey: false,
	cmdKey: false,
	tabKey: false
}

$(window).blur(function () { // this ensures that when the user switches windows, all keypress states are reset
	for (var prop in pressed) {
		pressed[prop] = false;
	}
});

$(document).contextmenu(function (e) {
	e.preventDefault();
}).keydown(function (e) {

	if (!$('.color input.user').is(':focus')) { // check that the user isn't actively typing in a color in the color tab
		if ($('.svg-contain').hasClass('show')) {
			if (cache.ele && cache.ele[0].tagName != 'text' || e.which == 9) { // Don't prevent key defaults when typing, BUT prevent the Tab Key from causing unwanted jumps in the page
				e.preventDefault();
			}
		}
		switch (e.which) {
			case 9: // Tab key is pressed
				$('.warn').toggleClass('show');
				break;
			case 16: // shift key pressed
				pressed.shiftKey = true;
				break;
			case 17:
				pressed.ctrlKey = true;
				break;
			case 18: // alt key (or option key on mac) is pressed
				pressed.altKey = true;
				break;
			case 32: // Spacebar is pressed
				if (cache.ele[0].tagName != 'text') { // if text is being edited, don't trigger spaceBar
					tool.type = 'drag';
					pressed.spaceBar = true;
				}
				break;
			case 91: // Command key is presssed on mac
			case 93:
				pressed.cmdKey = true;
				break;
			case 27: // Escape key is pressed
				if (tool.type == 'selection') {
					$('.selection').css('display', 'none');
					cache.svgID = -1; // ID of -1 indicates no element selected, cache.ele = -1 does the same thing
				} else {
					tool.type = 'selection';
				}
				break;
			case 8: // Backspace key (Windows) or Delete key (MacOS) pressed
			case 46: // Delete key (Windows)
				if (cache.mapKeysTo == 'canvas' && cache.ele && cache.ele[0].tagName != 'text') {
					cache.ele.remove();
					cache.svgID--;
				}
				layers.update();
				$('.selection').css('display', 'none');
				break;

			case 9:
				pressed.tabKey = true;
				break;
			case 20: // Caps lock key is pressed
				if (cache.mapKeysTo == 'color') {
					if ($('.color .user').is(':focus')) {
						$('.color .user').blur();
					} else {
						$('.color .user').focus();
					}
				}
				break;
		}
	}
	if ($(e.target).is('.color *')) {
		$('.color input.user').focus();
	}
}).keyup(function (e) {
	switch (e.which) {
		case 16: // Shift key is lifted
			pressed.shiftKey = false;
			break;
		case 17:
			pressed.ctrlKey = false;
			break;
		case 18:
			pressed.altKey = false;
			break;
		case 32: // Spacebar is lifted
			pressed.spaceBar = false;
			tool.type = 'selection';
			break;
		case 91: // Command key is lifted on mac
		case 93:
			pressed.cmdKey = false;
			break;
		case 9:
			pressed.tabKey = false;

	}
})

export { cache, drag, pressed };