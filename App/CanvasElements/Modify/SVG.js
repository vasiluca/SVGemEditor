//** This provides functionality that is shared among new SVG elements and editing existing SVG elements */
/** This functionality includes:
 * - Drawing the selection area box (shown after an element is created or edited)
 * - Having an Object which can be referenced to point to the static Object
 */

import { cache, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';
import { draw } from './Draw.js';
import { select } from '../Selection.js';

import { Line } from '../Elements/Element/Line.js';
import { Circle } from '../Elements/Element/Circle.js';
import { Ellipse } from '../Elements/Element/Ellipse.js';
import { Rectangle } from '../Elements/Element/Rectangle.js';
import { Text } from '../Elements/Element/Text.js';
import { Group } from '../Elements/Element/Group.js';
import { Path } from '../Elements/Element/Path.js';

import { resize } from './Transform/Resize.js';
import { move } from './Transform/Move.js';

import { tool } from '../../Tab/Tool.js';

//** This gives us easy access to Element Object functions, without requiring us to use a switch statement */
//** This is because JavaScript allows us to access object properties using this syntax:  Obj["key"] */
//** Which means we can pass in the object property we want to access as a String */
// Each of these type keys on the left should match the name given to the SVG element tags
var element = {
	line: Line,
	circle: Circle,
	ellipse: Ellipse,
	rect: Rectangle,
	text: Text,
	g: Group,
	path: Path
}

var translateX = 0;
var translateY = 0;
var svg = {
	numID: 0, // each time a new element is added, the ID is incremented
	created: false,

	resize: function (axis) { // resizing relies on no automatic selection area recalculating happening
		resize(this.initial, this.type);
	},
	move: function (direction) {
		move(this.initial, this.type);
		select.area(cache.ele);
		this.previewMove();
	},

	storeAttr: function () {
		cache.origSelectArea = {
			x: $('.selection')[0].getBoundingClientRect().left,
			y: $('.selection')[0].getBoundingClientRect().top,
			width: $('.selection')[0].getBoundingClientRect().width,
			height: $('.selection')[0].getBoundingClientRect().height
		}
		this.type = cache.ele[0].outerHTML.split(' ')[0].replace('<', '');
		if (!this.type) return;
		switch (this.type) { // Stores element-specific data for later manipulation
			case 'line':
				this.line = {
					x1: parseFloat(cache.ele.attr('x1')),
					x2: parseFloat(cache.ele.attr('x2')),
					y1: parseFloat(cache.ele.attr('y1')),
					y2: parseFloat(cache.ele.attr('y2'))
				}
				break;
			case 'rect':
				this.rect = {
					x: parseFloat(cache.ele.attr('x')),
					y: parseFloat(cache.ele.attr('y')),
					width: parseFloat(cache.ele.attr('width')),
					height: parseFloat(cache.ele.attr('height'))
				}
				break;
			case 'ellipse':
				this.ellipse = {
					cx: parseFloat(cache.ele.attr('cx')),
					cy: parseFloat(cache.ele.attr('cy')),
					rx: parseFloat(cache.ele.attr('rx')),
					ry: parseFloat(cache.ele.attr('ry'))
				}
				break;
			case 'circle':
				this.circle = {
					cx: parseFloat(cache.ele.attr('cx')),
					cy: parseFloat(cache.ele.attr('cy')),
					r: parseFloat(cache.ele.attr('rx'))
				}
				break;
			case 'g':
				break;
		}

		var scale = [1, 1];
		var rotate = 0;
		if (cache.ele.attr('transform')) {
			var propVal = cache.ele.attr('transform').replace(')', '').split(' ');
			for (var i = 0; i < propVal.length; i++) {
				if (propVal[i].startsWith('scale')) {
					var scaleX = parseFloat(propVal[i].split('(')[1].split(',')[0]);
					var scaleY = parseFloat(propVal[i].split('(')[1].split(',')[1]);
					scale = [scaleX, scaleY];
				}
				if (propVal[i].startsWith('rotate')) {
					rotate = parseFloat(propVal[i].split('(')[1].split('deg')[0]);
				}
			}
		}
		const coord = [cache.ele[0].getBBox().x, cache.ele[0].getBBox().y];
		const dimension = [cache.ele[0].getBBox().width, cache.ele[0].getBBox().height];
		this.initial = { // Stores x, y, etc. values so that it can be accessed later to calculate transformations
			x: coord[0],
			y: coord[1],
			width: dimension[0],
			height: dimension[1],
			right: coord[0] + dimension[0],
			bottom: coord[1] + dimension[1],
			scale: scale,
			rotate: rotate,
			preScaleH: Math.abs(cache.origSelectArea.height - cache.origSelectArea.height / scale[1]),
			preScaleW: Math.abs(cache.origSelectArea.width - cache.origSelectArea.width / scale[0])
		}
		this.newScale = scale;
	},
	previewMove: function () {
		var x1 = this.initial.x + this.initial.width/2;
		var y1 = this.initial.y + this.initial.height/2;
		var x2 = cache.ele[0].getBBox().x + cache.ele[0].getBBox().width/2;
		var y2 = cache.ele[0].getBBox().y + cache.ele[0].getBBox().height/2;
		if (pressed.cmdKey || pressed.shiftKey) {
			var viewportX = cache.origSelectArea.x + cache.origSelectArea.width / 2;
			var viewportY = cache.origSelectArea.y + cache.origSelectArea.height / 2;

			if (!$('.draggingPreview').length) {
				$('#editor').html($('#editor').html() + '<line class="draggingPreview" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="rgba(255,255,255,0.75)" stroke-width="' + (3 / doc.zoom) + '"></line>');
				$('#editor').html($('#editor').html() + '<line class="draggingPreview2" x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="orange" stroke-width="' + (1 / doc.zoom) + '"></line>');

			} else {
				$('.draggingPreview, .draggingPreview2').attr({
					'x1': x1,
					'y1': y1,
					'x2': x2,
					'y2': y2
				});
				var distance = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
				distance = (Math.round(10 * distance) / 10);

				var left = $('.draggingPreview2')[0].getBoundingClientRect().left + $('.draggingPreview2')[0].getBoundingClientRect().width / 2;
				var top = $('.draggingPreview2')[0].getBoundingClientRect().top + $('.draggingPreview2')[0].getBoundingClientRect().height / 2;
				$('.numberPreview').text(distance);
				if (distance < 50 / doc.zoom) {
					if (y1 < y2) {
						top = viewportY - 15;
					}
					if (y1 > y2) {
						top = viewportY + 15;
					}
					if (x1 < x2) {
						left = viewportX - 20;
					}
					if (x1 > x2) {
						left = viewportX + 20;
					}
				}
				$('.numberPreview').css({
					'display': 'block',
					'left': left,
					'top': top
				});
			}
		} else {
			$('.draggingPreview, .draggingPreview2').remove();
			$('.numberPreview').css('display', 'none');
		}
	},

	setColor: function () {

	},
	pathData: []
}

export { svg, element };