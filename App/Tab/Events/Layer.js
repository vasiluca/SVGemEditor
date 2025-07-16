import { cache, pressed, svgAction } from "../../Cache.js";
import { select } from "../../CanvasElements/Selection.js";

import { ui } from "../../UI.js";

import { layers } from "../Layer.js";

$(document).mouseup(function(e) {
	if (e.which == 1) {
		if (layers.multiSelect) {
			layers.multiSelect = false;
		}
		layers.selectedLayer = false;
	}

	if (cache.mapKeysTo == 'canvas') {
		if (svgAction.created) {
			layers.update();
			svgAction.created = false;
		} else {
			if ($(e.target).is('#editor *')) {
				if (!pressed.shiftKey) $('.layers .selected').removeClass('selected');
				console.log(cache.svgID);
				let selectLayer = document.querySelector('.layers .all > div#' + CSS.escape(cache.svgID));
				if (cache.svgID && selectLayer)
					selectLayer.classList.add('selected');
			} else if ($(e.target).is('#editor')) {
				$('.layers .selected').removeClass('selected');
			}
		}
	}
	
	
	layers.reorder = false;
	layers.pressed = false;
	$('.draggingLayer').remove();
});

$('.layers .all').on('mouseenter', 'div', function (e) {
	/*cache.ele = $(e.target).attr('id');
	select.area(true);*/
}).on('mousedown', 'div', function (e) {
	if (e.which == 1) { // Right Click
		cache.start = [e.clientX, e.clientY];
		layers.pressed = true;
		layers.selectedLayer = true;
		layers.current = $(this);
		cache.ele = $(this).attr('id');

		select.area(cache.ele);
	}
}).on('mouseup', 'div', function (e) {
	if (e.which == 1) { // 1 for e.which Indicates a LEFT click, e.which 2 - not used here - indicates middle mousewheel click
		if (layers.pressed && !pressed.cmdKey) {
			if (layers.reorder) {
				layers.drop($(this));
			} else if (layers.selectedLayer && !layers.multiSelect) {
				
				var selected = $(this).hasClass('selected');
				if (!pressed.shiftKey) $('.layers .all div').removeClass('selected');
				// if (pressed.shiftKey) {
					if (selected && pressed.shiftKey) {
						$(this).removeClass('selected');
					} else {
						$(this).addClass('selected');
					}
				// }
					// $('.layers div').removeClass('selected');
					
			} else {
				$(this).addClass('selected');
			}

			$('.draggingLayer').remove();
			$('.layers div').removeClass('drop-above drop-below drop-group');
			// $(this).addClass('selected');
		}
		if (!layers.multiSelect && !pressed.shiftKey) {
			// layers.selectedLayer = false;
		}

	} else if (e.which == 3) { // 3 for e.which Indicates a right click
		$(this).toggleClass('hidden');
		if (pressed.shiftKey) {
			if ($('.layers .selected').length > 1 && $(this).hasClass('selected')) {
				if ($(this).hasClass('hidden')) {
					$('.layers .selected').addClass('hidden');
					$('.layers .selected').each(function () {
						$('#editor #' + $(this).attr('id')).attr({ 'visibility': 'hidden' });
					});
				} else {
					$('.layers .selected').removeClass('hidden');
					$('.layers .selected').each(function () {
						$('#editor #' + $(this).attr('id')).removeAttr('visibility');
					});
				}
			}
		} else {
			if ($(this).hasClass('hidden')) {
				$('#editor #' + $(this).attr('id')).attr({ 'visibility': 'hidden' });
			} else {
				$('#editor #' + $(this).attr('id')).removeAttr('visibility');
			}
		}

	}
	
	
	// layers.selectedLayer = false;
	layers.reorder = false;

	layers.pressed = false;
}).on('mouseleave', 'div', function () {
	if (layers.pressed) {
		if (layers.reorder) {
			$('.layers div').removeClass('drop-above drop-below drop-group');
		} else if (layers.selectedLayer) {
			if (pressed.shiftKey) {
				layers.multiSelect = true;
				$(this).addClass('selected');
			}
		}
		if (cache.start[1] < cache.stop[1]) {
			$(this).addClass('layerAboveCursor');
		}
	}
	
}).on('mouseenter', 'div', function () {
	if (layers.pressed) {
		if (layers.multiSelect) {
			$(this).addClass('selected');
		} else if (!pressed.shiftKey) {
			layers.reorder = true;
			ui.showDropArea($(this));
		}
	}
	
}).on('mousemove', 'div', function () {
	if (layers.reorder) {
		ui.showDropArea($(this));
	}
}).mouseleave(function () {
	if (!layers.reorder) {
		layers.pressed = false;
	}
	
})