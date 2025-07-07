
import { cache, drag } from "./Cache.js";
import { tabStates } from "./Tabs.js";
import { util } from "./Tabs.js";

let tabPos = [0,0];
let mouseStart = [0,0];

$(document).mousemove(function (e) {
	const xDiff = e.clientX - mouseStart[0];
	const yDiff = e.clientY - mouseStart[1];
	if (cache.dragTab == true) {
		tabStates.focused.css({
			'left': tabPos[0] + xDiff,
			'top': tabPos[1] + yDiff,
			'bottom': 'auto',
			'right': 'auto'
		});
	}
});

$('.draggable').mousedown(function (e) {
	mouseStart = [e.clientX, e.clientY];
	if ($(e.target).is('.drag, .drag *') && e.which == 1) {
		cache.dragTab = true;
		tabPos = [$(this).offset().left, $(this).offset().top];
	}
	else if ($(e.target).is('.drag, .drag *') && e.which == 3) {
		$(this).attr('data-resetPos', true);
	}
	tabStates.indexUp($(this));
}).mouseup(function (e) {
	if ($(this).attr('data-resetPos') == 'true' && $(e.target).is('.drag, .drag *')) {
		tabStates.setTabs($(this));
		if ($(this).hasClass('color')) {
			tabStates.color.expand(false);
		}
	}
	tabStates.adjustPos();
	$(this).attr('data-resetPos', false);
}).dblclick(function (e) {
	if ($(e.target).is('.drag, .drag *')) {
		util.warn('Are you sure you want to reset all toolbar positions?', 'resetTabs');
	}
});