import { cache, pressed } from "../../Cache.js";

import { ui } from "../../UI.js";

import { layers } from "../Layer.js";

$('.layers .all').on('mouseenter', 'div', function (e) {
	/*cache.ele = $(e.target).attr('id');
	draw.selection(true);*/
}).on('mousedown', 'div', function (e) {
	if (e.which == 1) { // Right Click
		ui.resizeHandles(true);
		cache.start = [e.clientX, e.clientY];
		layers.select = true;
		layers.selectedLayer = false;
		layers.current = $(this);
		$('.selection').css('display', 'block');
		//cache.ele = $(this).attr('id');
		//draw.selection(cache.ele);
	}
}).on('mouseup', 'div', function (e) {
	if (e.which == 1) {
		if (layers.reorder) {
			layers.drop($(this));
		} else if (!layers.selecting) {
			var selected = $(this).hasClass('selected');
			if (pressed.shiftKey) {
				if (selected) {
					$(this).removeClass('selected');
				} else {
					$(this).addClass('selected');
				}
			} else {
				$('.layers div').removeClass('selected');
				$(this).addClass('selected');
			}
		}
		$('.draggingLayer').remove();
		$('.layers div').removeClass('drop-above drop-below drop-group');
	} else if (e.which == 3) {
		$(this).toggleClass('hidden');
		if ($(this).css('display')) {
			$(this).css('display', '');
		}
		if ($(this).hasClass('hidden')) {
			$('#editor #' + $(this).attr('id')).attr({ 'display': 'none' });
		} else {
			$('#editor #' + $(this).attr('id')).removeAttr('display');
		}
		if (!pressed.shiftKey) {
			if ($('.layers .selected').length > 1 && $(this).hasClass('selected')) {
				if ($(this).hasClass('hidden')) {
					$('.layers .selected').addClass('hidden');
					$('.layers .selected').each(function () {
						$('#editor #' + $(this).attr('id')).attr({ 'display': 'none' });
					});
				} else {
					$('.layers .selected').removeClass('hidden');
					$('.layers .selected').each(function () {
						$('#editor #' + $(this).attr('id')).removeAttr('display');
					});
				}
			}
		}

	}
	layers.select = false;
	layers.selecting = false;
	layers.reorder = false;
}).on('mouseleave', 'div', function () {
	if (layers.reorder) {
		$('.layers div').removeClass('drop-above drop-below drop-group');
	} else if (layers.select) {
		if (pressed.shiftKey) {
			layers.selecting = true;
			$(this).addClass('selected');
		} else {
			layers.reorder = true;
		}
	}
	if (cache.start[1] < cache.stop[1]) {
		$(this).addClass('layerAboveCursor');
	}
}).on('mouseenter', 'div', function () {
	if (layers.reorder) {
		ui.showDropArea($(this));
	} else if (layers.selecting) {
		$(this).addClass('selected');
	}
}).on('mousemove', 'div', function () {
	if (layers.reorder) {
		ui.showDropArea($(this));
	}
}).mouseleave(function () {
	if (layers.reorder) {
		$('.draggingLayer').remove();
	}
});