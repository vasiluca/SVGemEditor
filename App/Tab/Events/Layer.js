import { cache, pressed, svgAction } from "../../Cache.js";
import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { select } from "../../CanvasElements/Selection.js";
import { tabStates } from "../../Tabs.js";

import { ui } from "../../UI.js";

import { layers } from "../Layer.js";
import { tool } from "../Tool.js";

let selectLayer;
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
		}
		
		if ($(e.target).is('#editor, #editor *')) {
			if (!pressed.shiftKey) $('.layers .selected').removeClass('selected');

			selectLayer = document.querySelector('.layers .all div#' + CSS.escape(cache.svgID));

			if (selectLayer) {
				selectLayer.classList.add('selected');
				
			}
		} else if (tool.name === 'selection' && $(e.target).is('#editor')) {
			$('.layers .selected').removeClass('selected');
		}
		
	}
	
	
	layers.reorder = false;
	layers.pressed = false;
	$('.draggingLayer').remove();
	$('.layers .all').css('cursor', '');
}).on('dblclick contextmenu', function(e) {
	if (cache.mapKeysTo === 'canvas')
		if ($(e.target).is('#editor, #editor *, .selection'))
			if (selectLayer) {
				let scrollTo = 'center';
				if (selectLayer.getAttribute('data-svgem')) // data-svgem is auto-generated for all <g> elements
					scrollTo = 'start'; // for group elements scroll them into view at the top

				selectLayer.scrollIntoView({
					behavior: 'smooth',
					block: scrollTo
				});
			}
})

// expects this as argument
function ensureID(self) { // create an identifier for the canvas element if one does not correspond to the layers tab
	if (!$(self).attr('id')) {
		$(self).attr('id', newSVG.numID);

		const parent = self.parentElement;
		let index = $(parent).children().length - 1 - $(self).index();
		// const numChildren = ;

		let found;
		if ($(parent).is('section')) {
			const groupID = '[data-svgem="' + parent.getAttribute('id') + '"]';
			// console.log($('#editor').find(groupID));
			found = $('#editor').find(groupID).children().eq(index);
			// console.log(found);
		} else {
			found = $('#editor').children().eq(index);
			const children = found.children();
			if (found[0].tagName.toLowerCase === 'g' && children.length === 1) {
				found = children.eq(0);
			}
			console.log('not section');
		}
		found.attr('id', newSVG.numID);
		// cache.ele = newSVG.numID;

		select.area();

		newSVG.numID += 1;
	}
	
}

$('.layers .all').on('mouseenter', 'div', function (e) {
	/*cache.ele = $(e.target).attr('id');
	select.area(true);*/
}).on('mousedown', 'div', function (e) {
	tabStates.indexUp($('.layers'));

	e.stopPropagation();
	cache.mapKeysTo = 'layers';

	ensureID(this);

	if (e.which == 1) { // Left Click
		cache.start = [e.clientX, e.clientY];
		layers.pressed = true;
		layers.selectedLayer = true;
		layers.current = $(this);
		cache.ele = $(this).attr('id');

		const children = $(this).find('svg > g').eq(0);
		let child = children.find('g > *');
		if ($(this).children().length === 1 && child.children().length === 1)  {
			child = child.eq(0);

			if (child.attr('id')) 
				cache.ele = child.attr('id');
		}

		select.area(cache.ele);
	}
}).on('mouseup', 'div', function (e) {
	if (cache.mapKeysTo === 'layers') e.stopPropagation(); // this is here to prevent the parent group from getting triggered when the event bubbles up in the hierarhcy
	if (e.which == 1) { // 1 for e.which Indicates a LEFT click, e.which 2 - not used here - indicates middle mousewheel click
		let target = this;
		
		if (layers.pressed && !pressed.cmdKey) {
			if (layers.reorder) {
				ensureID(this); // ensure the mouse-up element has an ID
				
				// if ($(e.target).is('.group > section > div')) {
				// 	target = this.parentElement.parentElement;
				// 	console.log(target);
				// }
				layers.drop($(target));
				$('.layers .all').css('cursor', '');
			} else if (layers.selectedLayer && !layers.multiSelect) {
				
				var selected = $(target).hasClass('selected');
				if (!pressed.shiftKey) $('.layers .all div').removeClass('selected');
				// if (pressed.shiftKey) {
					if (selected && pressed.shiftKey) {
						$(target).removeClass('selected');
					} else {
						$(target).addClass('selected');
					}
				// }
					// $('.layers div').removeClass('selected');
					
			} else {
				$(target).addClass('selected');
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
	layers.multiSelect = false;
	layers.selectedLayer = false;
}).on('mouseleave', 'div', function (e) {
	// e.stopPropagation();
	if (layers.pressed) {
		if (!pressed.shiftKey && !layers.multiSelect) {
			layers.reorder = true;
		}
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
	
}).on('mouseenter', 'div', function (e) {
	if (cache.mapKeysTo === 'layers') e.stopPropagation(); // prevent this from propagating up and activating on the parent as well
	if (layers.pressed) {
		if (layers.multiSelect) {
			$(this).addClass('selected');
		} else if (!pressed.shiftKey) {
			layers.reorder = true;
			// ui.showDropArea($(this), e);
		}
	}
	
}).on('mousemove', 'div', function (e) {
	// console.log(cache.cursor);
	if (cache.mapKeysTo === 'layers') e.stopPropagation();
	cache.cursor = [e.clientX, e.clientY]; // compensate for the bubbling being prevented to the document
	if (layers.reorder) {
		// e.stopPropagation();
		ui.showDropArea($(this), e);
	}
}).mouseleave(function () {
	if (!layers.reorder) {
		layers.pressed = false;
	}
	
}).on('scroll', function(e) {
	layers.scroll = this.scrollTop;
})
