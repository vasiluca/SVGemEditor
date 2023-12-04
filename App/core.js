import { cache, pressed } from './Cache.js';
import { doc } from './SetUp.js';
import { tabStates, util } from './Tabs.js';
import * as TabEvents from  './TabEvents.js';
import { ui } from './UI.js';

import { svg } from './CanvasElements/Modify/SVG.js';
import { select } from './CanvasElements/Selection.js';
import * as SelectionEvents from './CanvasElements/SelectionEvents.js';
import * as Events from './CanvasElements/Events.js'; // No Objects exported there are event functions

import { tool } from './Tab/Tool.js'
import * as ToolEvents from './Tab/Events/Tool.js';
import { colors } from './Tab/Color.js';
import * as ColorEvents from './Tab/Events/Color.js';
import { property } from './Tab/Property.js';
import * as PropertyEvents from './Tab/Events/Property.js';
	import { Opacityproperty } from './Tab/Property/Opacity.js';
	import * as OpacityEvents from './Tab/Property/OpacityEvents.js';
	import { deleteButton } from './Tab/Property/DeleteButton.js';
	import * as deleteEvent from './Tab/Property/deleteEvent.js';

import { layers } from './Tab/Layer.js';
import * as LayerEvents from './Tab/Events/Layer.js';
import * as actions from './Tab/Action.js'; // No objects are actually exported frmo Action.js yet
	import { Export } from './Tab/Action/Export.js';
	import * as ExportEvents from './Tab/Action/ExportEvents.js';


deleteButton.initialize();

$(document).ready(function () {
	$('#editor').mousemove(function (e) {
		if ($(e.target).is('#editor *') && cache.press == false && tool.type == 'selection' && !pressed.handle) {
			cache.hoverEle = $(e.target).attr('id');
		} else {
			$('.outline').remove();
			$('.outline2').remove();
		}
	}).dblclick(function () {
		if (tool.name != 'selection') {
			tool.type = 'selection';
		}
	}).mouseup(function (e) {
		if (tool.name == 'image') {
			if (tool.imageIndex != -1) {
				var selection = tool.images[tool.imageIndex];
				var posX = e.clientX - selection.width / 2;
				var posY = e.clientY - selection.height / 2;
				// was previously selection.height and selection.width for height and width
				var element = '<image xlink:href="' + selection.result + '" height="' + 500 + '" width="auto" x="' + posX + '" y="' + posY + '"/>';
				$('#editor').html($('#editor').html() + element);
				if (!pressed.ctrlKey && tool.imageIndex > -1) {
					tool.imageIndex--;
				}
			}
			if (tool.imageIndex == -1) {
				tool.type = 'selection';
			}
		}
		if (pressed.spaceBar) {
			ui.cursor('grab');
		}
		layers.update();
	});



	$(document).mousemove(function (e) {

		if ($('.propertyScrubber').hasClass('show')) {
			if (cache.swipe) {
				property.setNumValue();
			} else {
				if (Math.abs(cache.stop[1] - cache.start[1]) > 20 || Math.abs(cache.stop[0] - cache.start[0]) > 20) {
					if (!$(e.target).is('.propertyScrubber, .propertyScrubber *')) {
						ui.scrubber(false);
					}
				}
			}
		}
		
	}).mouseup(function (e) {
		cache.swipe = false;
		if (cache.dragTab) {
			tabStates.adjustPos();
			cache.dragTab = false;
		}
		$('.outline').remove();
		$('.outline2').remove();
		$('.draggingPreview, .draggingPreview2').remove();
		$('.numberPreview').css('display', 'none');
		if ($('.propertyScrubber').hasClass('show')) {
			//cache.start = [e.clientX,e.clientY];
		}
		//$('.layers div').removeClass('drop-above drop-below drop-group');
	}).keydown(function (e) {
		if ($('.propertyScrubber').hasClass('show')) {
			if (e.which >= 48 && e.which <= 57) {

			}
		}
	});






















































	//** From this point, onward is non-crucial functionality or jQuery events (not as important to test) */
	// TODO: add the the below functions to their corresponding modules




	$(document).on('wheel', function (e) {
		if (!$(e.target).is('.tools *') && !$(e.target).is('.animatable')) {
			if (e.originalEvent.deltaY > 0) { // scrolling up - zooming out
				if (doc.zoom > 1 || doc.size[0] * doc.zoom > $(window).width() || doc.size[1] * doc.zoom > $(window).height()) {
					doc.zoom -= 0.25;
					if (doc.zoom > 10) {
						doc.zoom -= 0.5;
					}
				}
			}
			if (e.originalEvent.deltaY < 0) { // scrolling down - zooming in
				if (doc.zoom < 20) {
					doc.zoom += 0.25;
					if (doc.zoom < 10) {
						doc.zoom += 0.5;
					}
				}
			}
			var offsetTop = ($(window).height() / 2 - e.clientY) * doc.zoom;
			var offsetLeft = ($(window).width() / 2 - e.clientX) * doc.zoom;
			if (doc.zoom <= 1) {
				offsetTop = ($(window).height() - doc.size[1] * doc.zoom) / 2;
				offsetLeft = ($(window).width() - doc.size[0] * doc.zoom) / 2;
			}
			$('#editor').css({
				'transform': 'scale(' + doc.zoom + ')',
				'top': offsetTop,
				'left': offsetLeft,
				'transition': '0s'
			});
			select.area(cache.ele);
		}
	});

	function readAndInsert(file) {
		var reader = new FileReader();
		var image = new Image();
		image.src = this.result;
		var width = 100;
		var height = 100;
		reader.readAsDataURL(file);
		reader.onload = function () {
			tool.images.push({
				result: this.result,
				width: width,
				height: height
			});
		}
	}

	$('#inputFile').change(function (e) {
		tool.images = [];
		var files = e.target.files;
		tool.imageIndex = files.length - 1;
		tool.prevIndexIMG = files.length - 1;
		for (var i = 0; i < files.length; i++) {
			readAndInsert(files[i]);
		}
	});

	$('#image').contextmenu(function () {
		$('#inputFile').trigger('click');
	});

});