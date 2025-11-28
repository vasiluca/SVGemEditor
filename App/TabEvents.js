
import { cache, drag } from "./Cache.js";
import { tabStates } from "./Tabs.js";
import { util } from "./Tabs.js";

let tabPos = [0,0];
let mouseStart = [0,0];

let prevMapKeys = 'selection';

$(document).mousemove(function (e) {
	if (e.which !== 1) return; // prevent right mouse button from triggering move
	const xDiff = e.clientX - mouseStart[0];
	const yDiff = e.clientY - mouseStart[1];
	if (cache.dragTab) {
		tabStates.focused.css({
			'left': tabPos[0] + xDiff,
			'top': tabPos[1] + yDiff,
			'bottom': 'auto',
			'right': 'auto'
		});
	}
	
}).on('mouseup',function() {
	if (cache.dragTab) {
		cache.mapKeysTo = prevMapKeys;
	}
})


$('.draggable').mousedown(function (e) {
	mouseStart = [e.clientX, e.clientY];
	tabPos = [$(this).offset().left, $(this).offset().top];
	if ($(e.target).is('.drag, .drag *') && e.which == 1) {
		cache.dragTab = true;

		
		prevMapKeys = cache.mapKeysTo;
		cache.mapKeysTo = 'dragging'; // prevent mousemove not being detected when mousing over an element with stopPropagation()
	} else if ($(e.target).is('.drag, .drag *') && e.which == 3) {
		$(this).attr('data-resetPos', true);
	}
	// This adjusts the drag handle for cases when the window is resized
	if (!$(this).is('.color')) {
		let box = $(this);
		if (box.hasClass('verti')) {
			if (box.children('.drag').offset().top < 20) {
				box.children('.drag').remove();
				box.append('<span class="material-icons drag">drag_handle</span>');
			} else if (box.children('.drag').offset().top > $(window).height() - 20) {
				box.children('.drag').remove();
				box.prepend('<span class="material-icons drag">drag_handle</span>');
			}
		} else if (box.hasClass('horiz')) {
			if (box.children('.drag').offset().left < 20) {
				box.children('.drag').remove();
				box.append('<span class="material-icons drag">drag_handle</span>');
			} else if (box.children('.drag').offset().left > $(window).width() - 20) {
				box.children('.drag').remove();
				box.prepend('<span class="material-icons drag">drag_handle</span>');
			}
		}
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