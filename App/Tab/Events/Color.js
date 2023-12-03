import { cache, pressed } from "../../Cache.js";


import { ui } from "../../UI.js";

import { tabStates, util } from "../../Tabs.js";
import { colors } from "../Color.js";

import { property } from "../Property.js";
import { tool } from "../Tool.js";
import { layers } from "../Layer.js";


$('.color .col').click(function () {
	tabStates.color.expand();
	$('.col').addClass('hideButton');
});

$('.color input.user').keyup(function (e) {
	$('.col').css({
		'background-color': $(this).val(),
		'color': $(this).val()
	});
	if (e.which != 9) {
		colors.search($(this).val());
	}

	if (String.fromCharCode(e.which) == '(') {
		cache.inputRGB = true;
	}


	/*
	if (e.which == 8 && cache.inputRGB) { // Backspace key is pressed
	  cache.currVal -= 1;
	  if (cache.currVal < 0) {
		cache.colorVal = ['','',''];
		cache.inputRGB = false;
		$('.color input.user').val('');
	  } else {
		cache.colorVal[cache.currVal] = '';
	  }
	}*/
}).click(function () {
	$(this).select();
	cache.colorVal = ['', '', ''];
	cache.currVal = 0;
}).keydown(function (e) {
	if (e.which == 9) {
		e.preventDefault();
		if (!colors.currNum) {
			colors.currNum = 0;
		}
		if (pressed.shiftKey) {
			colors.currNum--;
		} else {
			colors.currNum++;
		}
		if (colors.currNum > colors.cached.length || colors.currNum < 0) {
			colors.currNum = 0;
		}
		$('.color input.user').val(colors.cached[colors.currNum]);
		$('.infoPanel').removeClass('show');
	}
	/*if (e.which >= 65 && e.which <= 90) {
	} else {
	  if (cache.inputRGB) {
		if (e.which >= 48 && e.which <= 57 || String.fromCharCode(e.which) == '(' ||
			String.fromCharCode(e.which) == ')' || String.fromCharCode(e.which) == ',' || e.which == 8) { // Backspace key pressed
		} else {
		  e.preventDefault();
		}
	  } else {
		e.preventDefault();
	  }
	}*/

	/*
	if (cache.inputRGB == true) {
	  e.preventDefault();
	  if (e.which >= 48 && e.which <= 57) {
		cache.colorVal[cache.currVal] += String.fromCharCode(e.which);
		if (cache.colorVal[cache.currVal].length >= 3) {
		  if (parseInt(cache.colorVal[cache.currVal]) > 255) {
			cache.colorVal[cache.currVal] = 255;
		  }
		  if (cache.currVal <= 3) {
			cache.currVal += 1;
		  }
		}
		$('.color input.user').val(cache.colorType + '(' + cache.colorVal[0] + ',' + (cache.colorVal[1] ? cache.colorVal[1] : '0') + ',' + (cache.colorVal[2] ? cache.colorVal[2] : '0') + ')');

	  }
	}
	*/

});

//$('.color').mousemove(function(e) {
//  var prevCol;
//  if ($(e.target).is('.swatches span')) {
//  } else {
//
//  }
//});
$('.swatches').on('click', 'span', function () {
	if (!$(this).hasClass('empty-space')) {
		var color = $(this).css('backgroundColor');
		$('.col').css({
			'background-color': color,
			'color': color
		});
		$('.color input.user').val($(this).attr('data-color').toUpperCase());
		if (property.colorTo != 'gradient') { // Check that the color is not a gradient, if it is don't change icon color
			tool[property.colorTo] = color;
			cache.ele.attr(property.colorTo, color);
			if (cache.ele.css(property.colorTo)) {
				cache.ele.css(property.colorTo, '');
			}
		}
		colors.push('recent', color);
		$('[aria-label="' + property.colorTo + '"]').css('color', color);
		if (color == $('.color input.user').val().toUpperCase().trim() && $('.swatches span').length == 1) {
			colors.draw(colors.tab);
		}
		layers.update();
		$('.swatches span').removeClass('selectionCursor');
		$(this).addClass('selectionCursor');
		tabStates.color.selectSwatch();
	}
	//cache.ele.attr()
}).on('contextmenu', 'span', function (e) {
	if (pressed.shiftKey) {
		$('.swatches .selected').each(function () {
			colors.action('save', $(this));
		});
	}
	colors.action('save', $(this));
}).on('dblclick', 'span', function (e) {
	if (pressed.shiftKey) {
		$('.swatches .selected').each(function () {
			colors.action('tune', $(this));
		});
	}
	colors.action('tune', $(this));
}).on('mouseenter', 'span', function () {
	$('.infocolor').css('font-size', 16);
	tabStates.color.info($(this));
}).on('mousedown', 'span', function (e) {
	if (!$(this).hasClass('empty-space')) {
		cache.start = [$(this).offset().left, $(this).offset().top];
		var name = $(this).attr('data-color'); // attr returns the actual exact value stored in an attribute
		var rgb = $(this).css('backgroundColor'); // getting the background color using CSS automatically returns an RGB value whether or not it was specified that way in the attribute
		var hex = util.rgb2hex(rgb);
		var hsl = util.rgb2hsl(rgb);
		if (colors.showRGB) {
			$('.infocolor .left').text(rgb);
			$('.infocolor .right').text(hsl);
		}
		if (e.which == 1) {
			if ($(this).attr('background-color') == name) { // the name is an HTML color which means it is accepted
				cache.dragColor = name;
			} else {
				cache.dragColor = rgb;
			}
		}
	}
}).on('mouseleave', 'span', function (e) {
	cache.hoveringColor = false;
	setTimeout(function () {
		if (!cache.hoveringColor) {
			$('.infoPanel').removeClass('show');
		}
	}, 1000);
	if (cache.dragColor && !$('.colorDragging').length) {
		$('body').append('<span class="colorDragging"></div>');
		colors.lastScrolled = colors.scrolled[colors.tab];
		if ($('.swatches').hasClass('smallColors')) {
			$('.colorDragging').addClass('smallColors');
		}
		$('.colorDragging').css({
			'background-color': $(this).css('backgroundColor'),
			'margin-top': ($(this).offset().top + $(this).height() / 2) - e.clientY,
			'margin-left': ($(this).offset().left + $(this).width() / 2) - e.clientX
		});
	}
	/*if (!pressed.shiftKey) {
	  var color = $('.col').css('background-color').toUpperCase();
	  if (property.colorTo != 'gradient') { // Check that the color is not a gradient, if it is don't change icon color
	   tool[property.colorTo] = color;
	   cache.ele.attr(property.colorTo,color);
	   if (cache.ele.css(property.colorTo)) {
		 cache.ele.css(property.colorTo,'');
	   }
	 }
   }*/
}).on('mouseup', 'span', function(e) {
	cache.dragColor = false;
});

$('.infoPanel').click(function () {
	if (!colors.selectingScheme) {
		$('.swatches, .infoPanel').toggleClass('smallColors');
		colors.updateRows();
		if ($('.swatches').hasClass('smallColors')) {
			if (colors.scrolled[colors.tab] < -colors.rows + 6) {
				$('.swatches').css('margin-top', -colors.rows * 16);
			} else {
				$('.swatches').css('margin-top', colors.scrolled[colors.tab] * 16);
			}
		} else {
			$('.swatches').css('margin-top', colors.scrolled[colors.tab] * 32);
		}
	}
}).contextmenu(function () {

});

$(document).keydown(function (e) {
	if (cache.mapKeysTo == 'colors' && !$('.color input.user').is(':focus')) {
		var nextIndex;
		var name;
		switch (e.which) {
			case 37: // Left arrow key is pressed
				if (pressed.cmdKey || !$('.swatches .selected')) {
					tabStates.color.tab('right');
				} else {
					tabStates.color.selection('left');
				}
				break;
			case 38: // Up arrow key is pressed
				if (pressed.cmdKey || !$('.swatches .selected').length) {
					colors.scroll('up');
				} else {
					tabStates.color.selection('up');
				}
				break;
			case 39: // Right arrow key is pressed
				if (pressed.cmdKey || !$('.swatches .selected').length) {
					nextIndex = $('.category .select').index() + 1;
					if (nextIndex <= 4) {
						$('.category span').removeClass('select');
						name = $('.category span').eq(nextIndex).addClass('select');
						colors.draw(name.attr('aria-label'));
					}
				} else {
					tabStates.color.selection('right');
				}
				break;
			case 40: // Bottom key is pressed
				if (pressed.cmdKey || !$('.swatches .selected').length) {
					colors.scroll();
				} else {
					tabStates.color.selection('down');
				}
				break;
			case 32: // Spacebar is pressed
				if (pressed.shiftKey) {
					colors.scroll('shiftSpace');
				} else {
					colors.scroll('space');
				}
				break;
			case 16: // Shift key is pressed
				break;
			case 9: // Tab key is pressed
				var nextIndex = $('.category .select').index();
				if (pressed.shiftKey) {
					nextIndex -= 1;
				} else {
					nextIndex += 1;
				}
				if (nextIndex < 0) {
					nextIndex = 4;
				} else if (nextIndex > 4) {
					nextIndex = 0;
				}
				$('.category span').removeClass('select');
				name = $('.category span').eq(nextIndex).addClass('select');
				colors.draw(name.attr('aria-label'));
				break;
			case 192:
				if ($('.swatches .selected').length > 1) {
					var selected = $('.swatches .selected.selectionCursor').index();
				} else if ($('.swatches .selectedFade').length >= 1) {
					var selectedFade = $('.swatches .selected.selectionCursor').index();
				}
				$('.swatches .selectionCursor.selected')
				if (pressed.shiftKey) {
					$('.swatches .selected:first-child').addClass('selectionCursor');

				}
				if ($('.swatches .selected').length > 1) {

				}
				break;
			case 13: // Enter key is pressed
				tabStates.color.selectSwatch();
				break;
			case 83: // S is pressed
				if (!cache.delayS) {
					if (pressed.shiftKey) {
						$('.swatches .selected').each(function () {
							colors.action('save', $(this), true);
						});
					} else {
						colors.action('save', $('.swatches .selectionCursor'), true);
					}
					cache.delayS = true;
					setTimeout(function () {
						cache.delayS = false;
					}, 250);
				}
				break;
			case 84: // T is pressed
				if (!cache.delayT) {
					if (pressed.shiftKey) {
						$('.swatches .selected').each(function () {
							colors.action('tune', $(this), true);
						});
					} else {
						colors.action('tune', $('.swatches .selectionCursor'), true);
					}
					cache.delayT = true;
					setTimeout(function () {
						cache.delayT = false;
					}, 250);
				}
				break;
			case 8: // Backspace is pressed
				colors.action(colors.tab, $('.swatches .selectionCursor'), false);
		}
	}
}).keyup(function () {
	tabStates.color.transitionScroll = true;
}).mousemove(function (e) {
	if (cache.dragColor) {
		if (pressed.shiftKey) {

		}
		$('.colorDragging').css({
			'top': e.clientY - $('.colorDragging').height() / 2,
			'left': e.clientX - $('.colorDragging').width() / 2
		});
		if ($('.colorDragging').length) {
			$('.colorDragging').addClass('dragging').css({
				'margin-top': 0,
				'margin-left': 0
			});
		}
		ui.cursorFeedback();
	}
	if (cache.resizingModule) {
		switch (cache.resizingModule) {
			case 'bottom':
				var increaseWidth = cache.stop[1] - cache.start[1];

		}
	}
}).mouseup(function (e) {
	if (cache.dragColor) {
		ui.sendColor();
	}
	cache.dragColor = false;

	cache.resizingModule = false;
})


$('.color').mouseover(function () {
	cache.mapKeysTo = 'colors';
}).mouseout(function () {

}).mousedown('.drag-bar', function (e) {
	//cache.start = [e.clientX,e.clientY];
	if ($(this).hasClass('horizontal')) {
		if ($(this).hasClass('bottom')) {
			cache.resizingColorModule = 'bottom';
		}
		if ($(this).hasClass('top')) {
			cache.resizingColorModule = 'bottom';
		}
	} else if ($(this).hasClass('vertical')) {
		if ($(this).hasClass('right')) {
			cache.resizingColorModule = 'right';
		}
		if ($(this).hasClass('left')) {
			cache.resizingColorModule = 'left';
		}
	}
}).mousedown('.drag-corner', function () {
	cache.resizingModule = $(this).attr('class').split(' ')[1];
});
var properties = {
	update: function () {
		//blu
	}
}



var last, diff;
$('.color').on('wheel', function (e) {
	if (!$(this).hasClass('expand')) {
		tabStates.color.quickView = true;
		tabStates.color.expand(true);
	}
	if (e.originalEvent.deltaY > 0) { // scrolling downward
		colors.scroll();
	}
	if (e.originalEvent.deltaY < 0) { // scrolling upward
		colors.scroll('up');
	}
	tabStates.indexUp($(this));
}).mouseleave(function (e) {
	setTimeout(function () {
		if (tabStates.color.quickView && !tabStates.color.keepOpen && !colors.animating) {
			tabStates.color.expand(false);
		}
	}, 1000);
	tabStates.color.keepOpen = false;
}).mouseenter(function () {
	if (tabStates.color.quickView) {
		tabStates.color.expand(true);
		tabStates.color.keepOpen = true;
	}
});

$('.color').on('contextmenu mouseup', '.colorCat li', function () {
	var color = $(this).text();
	$('.color input.user').val(color);
	switch (color) {
		case 'GREY':
			colors.search('WHITE GREY');
			break;
		case 'RED':
			colors.search('RED ORANGE PINK');
			break;
		case 'YELLOW':
			colors.search('YELLOW BROWN');
			break;
		default:
			colors.search(color);
	}
}).on('mouseup', '.schemes li', function () {
	ui.selectScheme($(this));
}).on('mousemove', '.schemes li', function (e) {
	var marginSize = 4;
	var cursorAreaW = $(this).width() - marginSize * 2;
	var offsetX = e.clientX - $(this).offset().left - marginSize;
	var percentage = offsetX / cursorAreaW;
	var amountScroll = -($(this).children('.colorsPreviewScroll').width() - $(this).width());
	var leftMargin = percentage * amountScroll;
	if (leftMargin > 0) {
		leftMargin = 0;
	}
	if (leftMargin < amountScroll) {
		leftMargin = amountScroll;
	}
	$(this).children('.colorsPreviewScroll').css('left', leftMargin);
}).on('contextmenu', '.schemes li', function () {

});

$('.color .drag-bar.vertical.right').mousedown(function (e) {

});

$('.category span').click(function () {
	var label = $(this).attr('aria-label');
	colors.draw(label);
	$('.schemes, .colorCat').removeClass('view');
	$('.category span').removeClass('select');
	$(this).addClass('select');
	$('[aria-label="palette"]').text('sort');
	$('.swatches').attr('data-category', label);
}).contextmenu(function () {
	switch ($(this).attr('aria-label')) {
		case 'palette':
			colors.draw('palette');
			colors.showSchemes();
			$('[aria-label="palette"]').text('filter_list');
			break;
		case 'recent':
			break;
		case 'saved':
			break;
	}
}).mousemove(function () {

}).mousedown(function () {
	$('.infoPanel').removeClass('show');
});

colors.draw();

ui.colorListPreview(); 
