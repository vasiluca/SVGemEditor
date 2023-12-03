/** This file contains the UI-related representations */
// TODO: This file may or may not be further broken down in the future and paired with the respective tabs (or canvas)
// For now it's okay to keep the UI more separate since we mostly want to focus on unit testing the functions

import { cache } from './Cache.js';
import { tabStates } from './Tabs.js';

import { colors } from './Tab/Color.js';
import { tool } from './Tab/Tool.js';
import { layers } from './Tab/Layer.js';
import { property } from './Tab/Property.js';

var ui = {
	cursor: function (type) {
		$('#editor').css('cursor', type);
		$('.selection').css('cursor', type);
	},
	resizeHandles: function (toggle) {
		if (!toggle) {
			$('.selection').addClass('selecting');
		}
		if (toggle) {
			$('.selection').removeClass('selecting');
		}
		/*if (toggle == 'selection') {
		  $('selection *').css('display','block');
		}*/
	},
	hideTools: function (toggle) {
		if (toggle == true) {
			$('.selection, .tools').addClass('hide');
			ui.cursor('grab');
		} else if (toggle == 'selection') {
			$('.selection').addClass('hide');
		} else {
			$('.selection, .tools').removeClass('hide');
			if (tool.type != 'selection') {
				ui.cursor('crosshair');
			}
		}
	},
	scrubber: function (toggle, direction) {
		if (toggle == false) {
			if ($('.propertyScrubber').hasClass('show')) {
				$('.propertyScrubber').removeClass('show');
				layers.update();
			}
		} else if (!$('.propertyScrubber').hasClass('show')) {
			if (direction == 'down') {
				$('.propertyScrubber').removeClass('show').addClass('down');
				$('.propertyScrubber').css({
					'top': cache.btnArea.bottom,
					'left': cache.btnArea.left + 2
				});
				setTimeout(function () {
					$('.propertyScrubber').addClass('show').css({
						'top': cache.btnArea.bottom
					});
				}, 1);
			} else {
				$('.propertyScrubber').removeClass('show').removeClass('down');
				$('.propertyScrubber').css({
					'top': cache.btnArea.top,
					'left': cache.btnArea.left + 2
				});
				setTimeout(function () {
					$('.propertyScrubber').addClass('show').css({
						'top': cache.btnArea.top - 190
					});
				}, 1);
			}
			$('.propertyScrubber .scrub').css({
				'background-color': property.scrubberTo.attr('stroke') ? tool.stroke : 'white'
			});
		}
	},
	location: function (btnName) {
		var btn;
		if (typeof btnName == 'string') {
			btn = {
				top: $('[aria-label="' + btnName + '"]').offset().top,
				bottom: $('[aria-label="' + btnName + '"]').offset().top + $('[aria-label="' + btnName + '"]').height(),
				left: $('[aria-label="' + btnName + '"]').offset().left,
				right: $('[aria-label="' + btnName + '"]').offset().left + $('[aria-label="' + btnName + '"]').width()
			}
		} else {
			btn = {
				top: btnName.offset().top,
				bottom: btnName.offset().top + btnName.height(),
				left: btnName.offset().left,
				right: btnName.offset().left + btnName.width()
			}
		}
		return (cache.stop[0] > btn.left && cache.stop[0] < btn.right && cache.stop[1] > btn.top && cache.stop[1] < btn.bottom);
	},
	cursorFeedback: function () { // Depending on where the user is dragging the color, it will change styles if it over a droppable area
		if (tabStates.index[tabStates.index.length - 1] != 'properties' && this.location($('.color'))) {
			if (this.location('saved') || this.location('tuner')) {
				$('.colorDragging').addClass('drop-shrink');
				this.location('saved') ? $('[aria-label="saved"]').addClass('validDrop') : $('[aria-label="tuner"]').addClass('validDrop');
			} else {
				$('.colorDragging').removeClass('drop-shrink');
				$('.category .material-icons').removeClass('validDrop');
			}
			if ($('[aria-label="tuner"]').hasClass('select') || $('[aria-label="saved"]').hasClass('select')) {
				if (this.location('palette')) {
					$('.colorDragging').addClass('remove');
				} else {
					$('.colorDragging').removeClass('remove');
				}
			}
		} else if (this.location($('.properties'))) {
			tabStates.indexUp($('.properties'));
			if ((this.location('stroke') || this.location('fill'))) {
				$('.colorDragging').addClass('drop-grow');
				$('.colorDragging').attr('data-overicon', 'border_color');
				if (this.location('fill')) {
					$('.colorDragging').attr('data-overicon', 'format_color_fill');
				}
			} else {
				$('.colorDragging').removeClass('drop-grow');
			}
		} else if (this.location($('.color'))) {
			$('.colorDragging').removeClass('drop-grow');
			tabStates.indexUp($('.color'));
		} else {
			$('.colorDragging').removeClass('drop-grow')
		}
	},
	sendColor: function () { //
		if (tabStates.index[tabStates.index.length - 1] != 'properties' && this.location($('.color'))) {
			if (this.location('saved')) {
				colors.push('saved', cache.dragColor);
				$('.colorDragging').addClass('shrink-out');
				var savedBtn = $('[aria-label="saved"]');
				$('.colorDragging').css({
					'left': savedBtn.offset().left + savedBtn.width() / 2 - $('.colorDragging').width() / 2,
					'top': savedBtn.offset().top + savedBtn.height() / 2 - $('.colorDragging').height() / 2
				});
			} else if (this.location('tuner')) {
				colors.push('tuner', cache.dragColor);
				$('.colorDragging').addClass('shrink-out');
				var tunerBtn = $('[aria-label="tuner"]');
				$('.colorDragging').css({
					'left': tunerBtn.offset().left + tunerBtn.width() / 2 - $('.colorDragging').width() / 2,
					'top': tunerBtn.offset().top + tunerBtn.height() / 2 - $('.colorDragging').height() / 2
				});
			} else if (this.location('palette') && ($('[aria-label="tuner"]').hasClass('select') || $('[aria-label="saved"]').hasClass('select'))) {
				if ($('[aria-label="tuner"]').hasClass('select')) {

				} else if ($('[aria-label="saved"]').hasClass('select')) {

				}
				$('.colorDragging').css({
					'opacity': 0,
					'filter': 'blur(5px)'
				});
			} else {
				$('.colorDragging').css({
					'left': cache.start[0],
					'top': cache.start[1]
				}).removeClass('dragging').addClass('scrolling');
			}
		} else if (this.location($('.properties'))) {
			var strokeBtn = $('[aria-label="stroke"]');
			if (this.location('stroke') || this.location('fill')) {
				if (this.location('stroke')) {
					tool.stroke = cache.dragColor;
					cache.ele.attr('stroke', cache.dragColor);
					if (cache.ele.css('stroke')) {
						cache.ele.css('stroke', '');
					}
					$('[aria-label="stroke"]').css('color', cache.dragColor);
				}
				if (this.location('fill')) {
					strokeBtn = $('[aria-label="fill"]');
					tool.fill = cache.dragColor;
					cache.ele.attr('fill', cache.dragColor);
					if (cache.ele.css('fill')) {
						cache.ele.css('fill', '');
					}
					$('[aria-label="fill"]').css('color', cache.dragColor);
				}
				colors.push('recent', cache.dragColor);
				property.colorTo = strokeBtn;
				$('.colorDragging').css({
					'left': strokeBtn.offset().left + strokeBtn.width() / 2 - $('.colorDragging').width() / 2,
					'top': strokeBtn.offset().top + strokeBtn.height() / 2 - $('.colorDragging').height() / 2
				}).addClass('grow-out');

			} else {
				tabStates.indexUp($('.color'));
				$('.colorDragging').css({
					'left': cache.start[0],
					'top': cache.start[1]
				}).removeClass('dragging').addClass('scrolling');
			}
			/*tool[property.colorTo] = $('.colorDragging').css('background-color');
			cache.ele.attr(property.colorTo,$('.colorDragging').css('background-color'));*/
		} else {
			$('.colorDragging').css({
				'left': cache.start[0],
				'top': cache.start[1]
			}).removeClass('dragging').addClass('scrolling');
		}
		setTimeout(function () {
			$('.colorDragging').remove();
			$('.category .material-icons').removeClass('validDrop');
		}, 500);
	},
	showDropArea: function (layer) {
		if (cache.stop[1] < layer.offset().top + 12) {
			$('.layers div').removeClass('drop-below drop-group');
			if (!($('.layers .selected').length >= 1 && layers.current.hasClass('selected') && layer.hasClass('selected'))) {
				layer.addClass('drop-above');
			}
		} else if (cache.stop[1] > layer.offset().top + layer.outerHeight() - 12) {
			$('.layers div').removeClass('drop-above drop-group');
			if (!($('.layers .selected').length >= 1 && layers.current.hasClass('selected') && layer.hasClass('selected'))) {
				layer.addClass('drop-below');
			}
		} else if (cache.stop[1] >= layer.offset().top + 12 && cache.stop[1] <= layer.offset().top + layer.outerHeight() - 12) {
			$('.layers div').removeClass('drop-above drop-below');
			layer.addClass('drop-group');
		} else {
			$('.layers div').removeClass('drop-above drop-below drop-group');
		}
		if (!$('.draggingLayer').length) {
			layers.current.clone().appendTo('.tools').addClass('draggingLayer');
		} else {
			$('.draggingLayer').css({
				'left': cache.stop[0] - layer.outerWidth() / 2
			});

			if ($('.draggingLayer').hasClass('layerAboveCursor')) {
				$('.draggingLayer').css({
					'top': cache.stop[1] - layer.outerHeight()
				});
			} else {
				$('.draggingLayer').css({
					'top': cache.stop[1]
				})
			}
		}
	},
	scrollbar: function (show) {
		if (show) {
			$('.scrollbar').addClass('show')
		} else {
			$('.scrollbar').removeClass('show')
		}
	},
	colorListPreview: function (scheme) {
		if (scheme) {
			var colorsPreview = $('.schemes ul li.' + scheme + ' .colorsPreview');
			colorsPreview.html('');

		} else {
			$('.schemes ul li').prepend('<div class="colorsPreview"></div><div class="colorsPreviewScroll"></div>');
			$('.schemes ul li').on('each', function () {
				var scheme = $(this).attr('data-scheme');
				var array = colors.collections[scheme].colors;
				var empty = colors.collections[scheme].empty;
				var skipOver = Math.floor((array.length - empty) / 49);
				skipOver == 0 ? skipOver = 1 : null;
				for (var i = 0; i < array.length; i++) {
					var color = array[i].split(' ')[0];
					if (color.trim() != '') {
						if (i % skipOver == 0) {
							$(this).children('.colorsPreview').append('<div style="background-image: linear-gradient(to bottom, ' + color + ' 16px, transparent 48px)"></div>');
						}
						$(this).children('.colorsPreviewScroll').append('<div style="background-image: linear-gradient(to bottom, ' + color + ' 16px, transparent 48px)"></div>');
					}
				}
			});
		}
	},
	infocolor: function (action) {
		$('infocolor').removeClass('quickhide');
		if (action == true) {
			$('.infoPanel').addClass('show');
		} else if (action == false) {
			$('.infoPanel').removeClass('show');
		} else {
			$('.infocolor').addClass('quickHide');
			$('.infoPanel').removeClass('show');
		}
	},
	selectScheme: function (ele) {
		if ($('.schemes').hasClass('view')) {
			//ele.addClass('transform-top');
			colors.scheme = ele.attr('data-scheme');
			$('.color input.user').val($(this).text());
			$('.schemes li').removeClass('selected');
			$('.schemes [data-scheme="' + colors.scheme + '"]').addClass('selected');
			$('.swatches').attr('data-scheme', colors.scheme);
			colors.scrolled.palette = 0;
			colors.draw();
			$('.schemes').removeClass('view');
		}
	}
}

export { ui }