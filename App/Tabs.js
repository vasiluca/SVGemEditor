//* This contains all functions that are shared among the draggable Tabs */

// import {} from './Tab/Tool.js';
// import {} from './Tab/Color.js';
// import {} from './Tab/Property.js';
// import {} from './Tab/Action.js';
// import {} from './Tab/Layer.js';

import { cache, pressed } from './Cache.js';

import { colors } from './Tab/Color.js';

var tabStates = {
	focused: undefined,
	color: {
	height: 306,
	quickView: false,
	expand: function (expand) { // Expand or collapse the color tab by specifying true or false or netierh to toggle
		if (expand == undefined) {
		$('.color').toggleClass('expand');
		this.quickView = false;
		} else if (expand) {
		$('.color').addClass('expand');
		} else if (!cache.dragColor) {
		$('.color').removeClass('expand');
		this.quickView = false;
		}
		$('.color').hasClass('expand') ? $('.col').html('<span class="material-icons">unfold_less</span>') : $('.col').html('<span class="material-icons">unfold_more</span>');
		if ($('.color').offset().top > $(document).height() - this.height - 11) {
		if ($('.color').hasClass('expand')) {
			$('.color').css({
			'top': $(document).height() - this.height - 10
			});
		} else {
			$('.color').css({
			'top': $(document).height() - 60
			});
		}
		} else if ($('.color').offset().top < 10) {
		$('.color').css({
			'top': 10
		});
		}
	},
	tab: function(dir) {
		index = $('.category .select').index();
		if (dir == 'left') {
		index -= 1;
		if (index >= 0) {
			$('.category span').removeClass('select');
			name = $('.category span').eq(nextIndex).addClass('select');
			colors.draw(name.attr('aria-label'));
		} else {
			index = 4;
		}
		} else {
		index += 1;
		if (index <= 4) {
			$('.category span').removeClass('select');
			name = $('.category span').eq(nextIndex).addClass('select');
			colors.draw(name.attr('aria-label'));
		} else {
			index = 0;
		}
		}
	},
	selection: function(dir) {
		var selected = $('.swatches .selectionCursor');
		var index = $('.swatches .selectionCursor').index();
		$('.swatches span').removeClass('selectedFade');
		var newIndex;
		cache.delayS = false;
		cache.delayT = false;
		if (selected.offset().top > $('.category').offset().top) {
		if (dir == 'up') {
			newIndex = index - colors.meta('ratio')[0];
		}
		if (dir == 'left') {
			newIndex = index - 1;
		}
		} else {
		colors.scroll('up');
		}
		if (selected.offset().top < $('.infoPanel').offset().top) {
		if (dir == 'down') {
			newIndex = index + colors.meta('ratio')[0];
		}
		if (dir == 'right') {
			newIndex = index + 1;
		}
		} else {
		colors.scroll('down');
		}
		if (newIndex >= 0 && newIndex < $('.swatches span').length) {
		if (pressed.shiftKey) {
			$('.swatches .selectionCursor').addClass('selected');
			$('.swatches span').eq(newIndex).addClass('selected');
		} else {

		}
		selected.removeClass('selectionCursor');
		$('.swatches span').eq(newIndex).addClass('selectionCursor');
		}
		if (dir == 'up' || dir == 'left') {
		if ($('.swatches .selectionCursor').offset().top <= $('.category').offset().top) {
			if ($('.swatches .selectionCursor').offset().top < $('.category').offset().top) {
			this.transitionScroll = false;
			}
			colors.scroll('up');
		}
		}
		if (dir == 'down' || dir == 'right') {
		if ($('.swatches .selectionCursor').offset().top >= $('.infoPanel').offset().top) {
			if ($('.swatches .selectionCursor').offset().top > $('.infoPanel').offset().top) {
			this.transitionScroll = false;
			}
			colors.scroll('down');
		}
		}
		if ($('.swatches .selectionCursor').hasClass('empty-space')) {
		if ($('.swatches .selectionCursor').index() < $('.swatches span').length-1) {
			this.selection(dir);
		}
		}
		tabStates.color.info($('.swatches .selectionCursor'));
		if (pressed.altKey) {
		$('.color .user').val($('.selectionCursor').attr('data-color'));
		}
	},
	info: function(color) {
		if (!color.hasClass('empty-space')) {
		var name = color.attr('data-color');
		var rgb = color.css('backgroundColor');
		cache.hoveringColor = true;
		var hex = util.rgb2hex(rgb);
		$('.infocolor').css('background-color', rgb);
		$('.infocolor .left').text(name);
		$('.infocolor .right').text(hex);
		var hsl = util.rgb2hsl(rgb,true);
		hsl < 50 ? $('.infocolor').addClass('light') : $('.infocolor').removeClass('light');
		hsl < 53 && hsl > 47 ? $('.infocolor').addClass('shadow') : $('.infocolor').removeClass('shadow');
		$('.infoPanel').addClass('show');
		if (pressed.shiftKey && !pressed.tabKey) {
			var color = ele.attr('data-color').toUpperCase();
			tool[property.colorTo] = color;
			cache.ele.css(property.colorTo,color);
			if (!cache.ele.attr(property.colorTo)) {
			cache.ele.attr(property.colorTo,$('.col').attr(''));
			}
		} else {

		}
		var diff = $('.infocolor span.left').innerWidth() + $('.infocolor span.right').innerWidth() - $('.infocolor').width();
		var size = 16;
		if (diff > -80) {
			size = 15;
		}
		if (diff > -70) {
			size = 14;
		}
		if (diff > -60) {
			size = 13;
		}
		if (diff > -50) {
			size = 12;
		}
		if (diff > -40) {
			size = 11;
		}
		$('.infocolor').css('font-size', size);

		}
	},
	selectSwatch: function() {
		$('.swatches span').removeClass('hideCursor');
		if (pressed.shiftKey) {
		if (!$('.swatches .new').length) {
			$('.swatches span').removeClass('selectedFade');
		}
		$('.swatches .selectedFade').addClass('selected').removeClass('selectedFade');
		$('.swatches span').removeClass('new');
		if ($('.swatches .selectionCursor').hasClass('selected')) {
			$('.swatches .selectionCursor').removeClass('selected').addClass('hideCursor');
		} else {
			$('.swatches .selectionCursor').addClass('selected');
		}
		} else {
		var selected = $('.swatches .selected');
		if ($('.swatches .selected').length > 1) {
			$('.swatches .selected').addClass('selectedFade').removeClass('selected');
			$('.swatches .selectionCursor').addClass('new');
		} else if (!$('.swatches .selectionCursor').hasClass('new')) {
			$('.swatches span').removeClass('selected selectedFade new');
			if (!$('.swatches .selectionCursor').hasClass('selected')) {
			$('.swatches span').removeClass('selectedFade');
			}
			if (selected.length) {
			selected.addClass('selectedFade');
			}
		}
		$('.swatches .selectionCursor').addClass('selected');
		}
	},
	transitionScroll: true
	},
	index: [],
	indexUp: function(ele) { // This moves any tabs that are pressed to the top of the other tabs
	this.focused = ele;
	if (this.index.length == 0) {
		var that = this;
		$('.draggable').each(function() {
		that.index.push($(this).attr('class').split(' ')[1]);
		});
	}
	var name = ele.attr('class').split(' ')[1];
	var index = this.index.indexOf(name);
	this.index.splice(index, 1);
	this.index.push(name);
	$.each(this.index, function(index, value) {
		$('.'+value).css({'z-index': index});
	});
	},
	tabsPos: [], // Saved tab positions for later use (when resetting tab positions)
	setTabs: function(action /*Parameter should be "set", "all", or $(this)*/) {
	var that = this;
	if (action == 'set') {
		$('.draggable').each(function() {
		that.tabsPos.push([$(this).offset().left,$(this).offset().top]);
		})
	} else if (action == 'all') { // reset ALL tab positions to default
		$.each(that.tabsPos,function(index,value) {
		$('.draggable').eq(index).css({'left': value[0], 'top': value[1]});
		});
	} else {
		var index = action.index('.draggable');
		$('.draggable').eq(index).css({'left': this.tabsPos[index][0],'top': this.tabsPos[index][1]});
	}
	},
	adjustContents: function() {

	},
	adjustPos: function(tab) {
	var height = this.focused.height();
	var width = this.focused.width();
	var box = this.focused;
	if (tab) {
		height = tab.height();
		width = tab.width();
		box = tab;
		$('.draggable').css('transition','all 0s');
	} else {
		$('.draggable').css('transition','');
	}
	var winH = $(window).height();
	var winW = $(window).width();
	if (cache.dragTab == true || tab) {
		if (box.hasClass('verti')) {
		if (box.offset().left < -width / 2) {
			box.css('left', -width / 2);
		}
		if (box.offset().top + 20 > winH) {
			box.css('top', winH - 20);
		}
		if (box.offset().left + width / 2 > winW) {
			box.css('left', winW - width / 2);
		}
		if (box.offset().top < -height + 20) {
			box.css('top', -height + 20);
		}
		}
		if (box.hasClass('horiz')) {
		if (box.offset().top + 25 > winH) {
			box.css('top', winH - 25);
		}
		if (box.offset().left + 20 > winW) {
			box.css('left', winW - 20);
		}
		if (box.offset().top < -25) {
			box.css('top', -25);
		}
		if (box.offset().left < -width + 20) {
			box.css('left', -width + 20);
		}
		}

		if (box.offset().top < 20) {
		if (box.hasClass('verti')) {
			box.children('.drag').remove();
			box.append('<span class="material-icons drag">drag_handle</span>');
		}
		if (-20 < box.offset().top) {
			box.css('top', 10);
		}
		if (box.offset().top < 20 - height) {
			if (!box.hasClass('orientHorizontal')) {
			box.addClass('orientHorizontal');
			} else if (!box.hasClass('horiz')) {
			box.addClass('horiz').removeClass('verti');
			box.css({
				'top': 10
			});
			setTimeout(function() {
				if (box.offset().left + width > winW) {
				box.css({
					'left': winW - width - 10
				});
				}
			}, 10);
			}
		}
		} else {
		box.removeClass('orientHorizontal');
		}
		if (box.offset().left + width > winW - 20) {
		if (box.hasClass('horiz')) {
			box.children('.drag').remove();
			box.prepend('<span class="material-icons drag">drag_handle</span>');
		}
		if (box.offset().left + width < winW + 20) {
			box.css({
			'left': winW - 10 - width
			});
		}
		}
		if (box.offset().left < 20) {
		if (box.hasClass('horiz')) {
			box.children('.drag').remove();
			if (box.hasClass('color')) {
			box.children('.col').after('<span class="material-icons drag">drag_handle</span>');
			} else {
			box.append('<span class="material-icons drag">drag_handle</span>');
			}
		}
		if (box.offset().left > -20) {
			box.css({
			'left': 10
			});
		}
		if (box.offset().left < 20 - width) {
			if (!box.hasClass('orientVertical')) {
			box.addClass('orientVertical');
			} else if (!box.hasClass('verti')) {
			box.addClass('verti').removeClass('horiz');
			box.css({
				'left': 10
			});
			setTimeout(function() {
				if (box.offset().left + width > winW) {
				box.css({
					'left': winW - width - 10
				});
				}
			}, 1);
			}
		}
		} else {
		box.removeClass('orientVertical');
		}
		if (box.offset().top + height > winH - 20) {
		if (box.hasClass('verti')) {
			box.children('.drag').remove();
			box.prepend('<span class="material-icons drag">drag_handle</span>');
		}
		if (box.offset().top + height < winH + 20) {
			box.css({
			'top': winH - height - 10
			});
		}
		box.addClass('orientHorizontal');
		}
		cache.dragTab = false;
	}
	if (cache.dragTab == 'resetTools' && $(e.target).is('.drag')) {
		$('.shapes').css({
		'top': 10,
		'left': 10
		});
		$('.color').css({
		'top': $(document).height() - $('.color').height() - 10,
		'left': 10
		});
		cache.dragTab = false;
	}
	},
	adjustAllPos: function() {
	$.each(this.index, function(index, value) {
		console.log(value);
		tabStates.adjustPos($('.'+value));
	});
	}
}
tabStates.setTabs('set');

var util = {
	rgb2hex: function( color_value ) {
		if ( ! color_value ) return false;
		var parts = color_value.toLowerCase().match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+(?:\.\d+)?))?\)$/),
			length = color_value.indexOf('rgba') ? 3 : 2; // Fix for alpha values
		delete(parts[0]);
		for ( var i = 1; i <= length; i++ ) {
		parts[i] = parseInt( parts[i] ).toString(16);
		if ( parts[i].length == 1 ) parts[i] = '0' + parts[i];
		}
		return '#' + parts.join('').toUpperCase(); // #F7F7F7
	},
	rgb2hsl: function(rgb,brightness) {
		rgb = rgb.replace(')','').split('(');
		rgb = rgb[1].split(',');
		var r = parseInt(rgb[0]) / 255;
		var g = parseInt(rgb[1]) / 255;
		var b = parseInt(rgb[2]) / 255;

		var max = Math.max(r, g, b), min = Math.min(r, g, b);
		var h, s, l = (max + min) / 2;

		if (max == min) {
		h = s = 0; // achromatic
		} else {
		var d = max - min;
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

		switch (max) {
			case r: h = (g - b) / d + (g < b ? 6 : 0); break;
			case g: h = (b - r) / d + 2; break;
			case b: h = (r - g) / d + 4; break;
		}

		h /= 6;
		}
		if (brightness) {
		return Math.round(l * 100);
		} else {
		return 'hsl('+Math.round(h*100)+','+Math.round(s*100)+'%,'+Math.round(l*100)+'%)';
		}
	},
	warn: function(txt,success,fail,btn1 = 'CANCEL',btn2 = 'CONFIRM') {
		$('.warn p').text(txt);
		$('.warn .cancel').text(btn1);
		$('.warn .confirm').text(btn2);
		$('.warn').addClass('show');
		$('.warn').click(function(e) {
		switch($(e.target).attr('class')) {
			case 'confirm':
			$('.warn').removeClass('show');
			success == 'resetTabs' ? tabStates.setTabs('all') : null;
			break;
			case 'cancel':
			$('.warn').removeClass('show');
		}
		});
	},
	//colorChannelA and colorChannelB are ints ranging from 0 to 255
	colorChannelMixer: function (colorChannelA, colorChannelB, amountToMix){
		var channelA = colorChannelA*amountToMix;
		var channelB = colorChannelB*(1-amountToMix);
		return parseInt(channelA+channelB);
	},
	//rgbA and rgbB are arrays, amountToMix ranges from 0.0 to 1.0
	//example (red): rgbA = [255,0,0]
	colorMixer:function(rgbA, rgbB, amountToMix){
		var r = this.colorChannelMixer(rgbA[0],rgbB[0],amountToMix);
		var g = this.colorChannelMixer(rgbA[1],rgbB[1],amountToMix);
		var b = this.colorChannelMixer(rgbA[2],rgbB[2],amountToMix);
		return "rgb("+r+","+g+","+b+")";
	},
	classifyColor: function(rgb) {
		var colors = rgb.split('(')[1].replace(')','').split(',');
		colors[0] = Math.floor(rgb[0] / 51);
		colors[1] = Math.floor(rgb[1] / 51);
		colors[2] = Math.floor(rgb[2] / 51);
		switch (colors) {
		case [0,0,0]:

		}
	}
}

export { tabStates, util }