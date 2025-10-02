/** This contains all functions pertaining to the Colors Tab */
import { cache, pressed } from '../Cache.js';
import { ui } from '../UI.js';

import { tabStates } from '../Tabs.js';

import { collections } from './Color/ColorSchemes.js';
import { tool } from './Tool.js';
import { property } from './Property.js';
import { layers } from './Layer.js';

var colors = { // This object contains data for the color draggable component
	height: $('.swatches').outerHeight(),
	scheme: 'html',
	tab: 'palette',
	settings: {
		showRGB: false
	},
	searching: false,
	saved: [],
	rows: 0,
	columns: 7,
	scrolled: {
		'palette': 0
	},
	animating: false,
	updateRows: function () {
		const rows = $('.swatches').hasClass('smallColors') ? $('.swatches span').length / this.columns / 2 - (this.columns - 1) : $('.swatches span').length / this.columns - (this.columns - 1);
		this.rows = Math.round(rows) + 1;
	},
	setColor: function(colorEl, color) { // colorEl, if used, is expected to be a jQuery element object
		function ensureChild(property, color) {
			if (cache.ele[0].tagName.toLowerCase() === 'g') {
				const children = cache.ele.children();
				if (children.length === 1) {
					const child = children.eq(0);
					child.attr(property, color);
					if (child.css(property))
						child.css(property, '');
				}
			}
		}
		if (colorEl) {
			if (colorEl.hasClass('empty-space'))
				return; // some collections use a transparent color to create spacing, ignore them
			
			$('.color input.user').val(colorEl.attr('data-color').toUpperCase());
			color = colorEl.css('backgroundColor');
			$('.swatches span').removeClass('selectionCursor');
			colorEl.addClass('selectionCursor');
		}

		if (cache.ele) {
			color = color.replace(/\s*,\s*/g, ',');
			$('.col').css({
				'background-color': color,
				'color': color
			});

			if (CSS.supports(property.colorTo, color)) {
				if (property.colorTo != 'gradient') { // Check that the color is not a gradient, if it is don't change icon color
					tool[property.colorTo] = color;

					cache.ele.attr(property.colorTo, color);
					ensureChild(property.colorTo, color);

					if (cache.ele.css(property.colorTo)) {
						cache.ele.css(property.colorTo, '');
					}
				}
				colors.push('recent', color);
				$('[aria-label="' + property.colorTo + '"]').css('color', color);
				layers.update();

				tabStates.color.selectSwatch();
			}
			
		}
	},
	action: function (action, ele, force) {
		if (!ele || !ele.hasClass('empty-space')) {
			var color = ele.attr('data-color');
			var colNum = $('.swatches span').index(ele);
			var location;
			if (action == 'save') {
				location = 'saved';
			} else if (action == 'tune') {
				location = 'tuner';
			} else {
				location = colors.tab;
			}
			if (location == colors.tab && !force) {
				if (ele.hasClass('deleted')) {
					this[location].splice(colNum, 0, color);
					ele.removeClass('deleted');
					this.animate(ele, 'palette', true);
				} else {
					var find = this[location].indexOf(color);
					this[location].splice(find, 1);
					ele.addClass('deleted');
					this.animate(ele, 'palette');
				}
			} else {
				if (!CSS.supports('background', color)) {
					color = window.getComputedStyle(ele[0]).getPropertyValue('background-color');
					
				}
				color = color.replace(/\s*,\s*/g, ',');
				
				this.push(location, color);
				this.animate(ele, location);
			}
		}
	},
	selectingScheme: false,
	scroll: function (dir) {
		if (!this.selectingScheme) {
			if (!this.scrolled[this.tab]) {
				this.scrolled[this.tab] = 0;
			}
			var scrolled = this.scrolled[this.tab];
			if (dir == 'up' && !pressed.tabKey) {
				if (scrolled < 0) {
					scrolled += 1;
				}
			} else {
				if (dir == 'space') {
					scrolled -= 6;
					if (scrolled < -this.rows) {
						scrolled += -scrolled - this.rows;
					}
					if (scrolled > 0)
						scrolled = 0;
				} else if (dir == 'shiftSpace') {
					scrolled += 6;
					if (scrolled > 0) {
						scrolled = 0;
					}
				} else if (!pressed.tabKey) {
					if (scrolled > -this.rows) {
						scrolled -= 1;
					}
				}
			}
			this.scrolled[this.tab] = scrolled;
			if (tabStates.color.transitionScroll) {
				$('.swatches').css('transition', 'margin 0.15s ease');
			}
			$('.swatches').css('margin-top', scrolled * 32);
			setTimeout(function () {
				$('.swatches').css('transition', 'margin 0s');
			}, 150);
			var marginDrag = (this.scrolled[this.tab] - this.lastScrolled) * 32;
			if ($('.colorDragging').length && !$('.colorDragging').hasClass('shrink-out') && !$('.colorDragging').hasClass('grow-out')) {
				$('.colorDragging').css({
					'margin-top': marginDrag
				});
				if (cache.start[1] - marginDrag <= $('.category').offset().top && cache.start[1] - marginDrag >= $('.infocolor').offset().top) {
					$('.colorDragging').css({
						'opacity': 0
					});
				}
			}
		}
	},
	append: function (element) {
		var colorVal, colorName, synonyms;
		synonyms = element.split(' '); // Extracts all the color designations/names/synonyms from the string
		colorVal = synonyms[0];
		colorName = colorVal; // by default color name is just the first value (whether it's HTML name, hex, or rgb)

		if (synonyms.length > 1) { // If there is more than one color designation
			if (colorVal.charAt(0) == '#' || colorVal.startsWith('rgb(')) { // check that the first one is not a hex or rgb, otherwise replace it with a name
				colorName = synonyms[1].replace(/_/g, ' '); // overwrite underscores (if there are) with spaces for the color name to display to the user
			}
		}

		$('.swatches').append('<span style="background:' + colorVal + '" data-color="' + colorName + '" ' + (colorVal == '' ? 'class="empty-space"' : '') + '></span>');
		this.updateRows();
		this.cached.push(colorName);
	},
	draw: function (array) {
		this.selectingScheme = false;
		if (!array) {
			array = this.tab;
		}
		this.searching = false;
		
		$('.swatches').html('');
		for (var i = 0; i < this[array].length; i++) {
			this.append(this[array][i]);
		}
		this.updateRows();
		
		let scrollAmt = this.scrolled[array] ? this.scrolled[array] : 0;
		// if (scrollAmt*32 <= $('.swatches').height() - 32) {
		// 	this.scrolled[array] = 0;
		// }
		$('.swatches').css('margin-top', scrollAmt * 32);
		this.tab = array;
		$('.infoPanel .tabName').html(this.tab.toUpperCase());
	},
	recent: [],
	push: function (array, color) {
		for (var i = 0; i < this[array].length; i++) {
			if (this[array][i] == color.toUpperCase()) {
				this[array].splice(i, 1);
			}
		}
		this[array].unshift(color.toUpperCase());
	},
	cached: [],
	search: function (color) {
		color = color.toUpperCase().trim().replace(/\s*,\s*/g, ',').split(/[, ]/g);
		this.currColor = color[0].trim();
		
		this.searching = true;
		$('.infoPanel').removeClass('show');
		$('.swatches').html('');
		for (var i = 0; i < this[this.tab].length; i++) {
			for (var j = 0; j < color.length; j++) {
				if (color.length > 1 && color[j].trim() === '') continue;
				if (this[this.tab][i].indexOf(color[j]) !== -1) {
					this.append(this[this.tab][i]);
				}
			}
		}
		if (this.cached.length == 0) {
			if ($('.color input.user').val().charAt(0) != '#') {
				$('.swatches').html('<div class="status">No colors named "' + color + '" found in your ' + this.tab + '.</div>');
			} else {
				this.draw(this.tab);
			}
		}
		$('.swatches').css('margin-top', 0);
		this.updateRows;
		if (this.cached.length == 1 && this.cached[0] == color) {
			this.draw();
			tool[property.colorTo] = color;
		}
		
		if (color[0] === '') // reset scroll position to previous when search field is cleared
			$('.swatches').css('margin-top', this.scrolled[this.tab] * 32);
		else
			$('.swatches').css('margin-top', 0);
	},
	categories: $('.colorCat'),
	schemes: $('.schemes'),
	showCategories: function () {
		this.tab = 'palette';
		$('.swatches').html('').css('margin-top', 0);
		this.categories.appendTo('.swatches');
		this.categories.css({ 'display': 'block' });
		this.rows = 0;
	},
	showSchemes: function () {
		colors.selectingScheme = true;
		this.tab = 'palette';
		this.schemes.addClass('view');
	},
	currentID: 0,
	animate: function (that, where, reverse) {
		this.currentID++;
		var id = this.currentID;
		var ele = $('<div class="animatable"></div>').attr('id', id).appendTo($('.animatables'));
		var to = {
			palette: $('.category span[aria-label="palette"]'),
			saved: $('.category span[aria-label="saved"]'),
			tuner: $('.category span[aria-label="tuner"]')
		}
		var goto = to[where];
		goto.addClass('animate');
		var lastCoord;
		var newAnimationPoint = (props, coordinates = lastCoord) => {
			$('.animatable#' + id).css({
				'top': coordinates[0],
				'left': coordinates[1],
				'transform': 'scale(' + props.scale + ')',
				'transition': 'all ' + props.trans + 's ease',
				'opacity': props.opac ? props.opac : 1,
				'visibility': !props.visib ? 'visible' : 'hidden',
				'border-radius': props.border ? '50%' : '0',
				'background': that.css('backgroundColor'),
				'box-shadow': props.shadow ? '0 0 5px rgba(0,0,0,0.5)' : '0 0 5px rgba(0,0,0,0)',
				'height': props.small ? 16 : 32
			});
			lastCoord = coordinates;
		};
		if (reverse == true) {
			newAnimationPoint({ scale: 0, opac: 0, trans: 0, shadow: true, border: true }, [goto.offset().top, goto.offset().left + 3.5]);
			newAnimationPoint({ scale: 1, opac: 1, trans: 0.5, shadow: true, border: true }, [that.offset().top, that.offset().left]);
			setTimeout(function () {
				goto.removeClass('animate');
				newAnimationPoint({ scale: 1, trans: 0.25, opac: 1, shadow: false, small: $('.swatches').hasClass('smallColors') ? true : false });
			}, 250);
			/*newAnimationPoint({scale: 0, trans: 0, opac: 0.5, border: true}, [goto.offset().top,goto.offset().left + 3.5]);
			newAnimationPoint({scale: 0, trans: 0.25, opac: 1, border: true, shadow: true});
			newAnimationPoint({scale: 1, trans: 0.5, opac: 1, border: true, shadow: true}, [that.offset().top,that.offset().left]);
			setTimeout(function() {
			to[where].removeClass('animate');
			newAnimationPoint({scale: 1, trans: 0.5, opac: 1, border: false, visib: false, shadow: false});
			}, 250);*/
		} else {
			newAnimationPoint({ scale: 1, trans: 0, opac: 1, shadow: true, small: $('.swatches').hasClass('smallColors') ? true : false }, [that.offset().top, that.offset().left]);
			newAnimationPoint({ scale: 0.6, opac: 1, trans: 0.5, border: true, shadow: true }, [goto.offset().top, goto.offset().left + 3.5]);
			setTimeout(function () {
				goto.removeClass('animate');
				newAnimationPoint({ scale: 0, opac: 0.5, trans: 0.25, shadow: true, border: true });
			}, 250);
		}
		var obj = this;
		setTimeout(function () {
			$('.animatable#' + id).remove();
			setTimeout(function () {
				obj.animating = false;
			}, 500);
		}, 500);
	},
	picker: [],
	tuner: [],
	get palette() {
		return collections[this.scheme].colors;
	},
	getCollection: function (scheme) {
		return collections[scheme].colors;
	},
	meta: function (key) {
		return collections[this.scheme][key];
	}
}




export { colors };