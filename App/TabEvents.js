
import { cache } from "./Cache.js";
import { tabStates } from "./Tabs.js";
import { util } from "./Tabs.js";

$(document).mousemove(function (e) {
	if (cache.dragTab == true) {
		tabStates.focused.css({
			'left': e.clientX - cache.start[0],
			'top': e.clientY - cache.start[1],
			'bottom': 'auto',
			'right': 'auto'
		});
	}
});

$('.draggable').mousedown(function (e) {
	if ($(e.target).is('.drag, .drag *') && e.which == 1) {
		cache.dragTab = true;
		cache.start = [e.clientX - $(this).offset().left, e.clientY - $(this).offset().top];
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