//** This provides functionality that is shared among new SVG elements and editing existing SVG elements */
/** This functionality includes:
 * - Drawing the selection area box (shown after an element is created or edited)
 * - Having an Object which can be referenced to point to the static Object
 */

import { cache, drag, pressed } from '../../Cache.js';
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
import { GenericElement } from '../Elements/Element/GenericElement.js';

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
	genericElement: GenericElement
	// g: Group,
	// path: Path,
	
}



function getSVGTransform(el, includeParents) {
	const editor = document.querySelector('#editor');

	// child.getCTM() -> includes child transforms + viewBox + outer <svg> placement (and CSS tranforms)
	// DEPRECATED: child.getTransformToElement(svg) included child transforms + viewBox, while excluding outer <svg> placement, but is now DEPRACATED
	// when calling getCTM() on a child element it includes, all parent transforms (including external <svg> placement like CSS transforms)
	// however calling getCTM() on the root <svg> element returns the internal coordinate transforms like viewBox, while ignoring external CSS transforms (because <svg> has not parent svg element)
	function getCTMIgnoreRoot() { // we need to handle the fact that getCTM also factors in the root SVG element
		// console.log(el);
		if (!el) return false;
		const svg = el.ownerSVGElement || editor; // we could also directly access the svg#editor element

		const elementCTM = el.getCTM();
		const svgCTM = svg.getCTM(); // root's CTM (viewport transform)
		if (!elementCTM || !svgCTM) return null;

		// Multiply element's CTM by inverse of root's CTM, which strips the root <svg> transforms leaving element's transform relative to internal coordinates (but BEFORE viewBox/viewport scaling)
		return svgCTM.inverse().multiply(elementCTM);
	}
	let m = el?.transform?.baseVal; // through baseVal, we get only the local transform while excluding parent transforms

	let ctm;
	if (includeParents) { // getCTM() includes SVG positioning attributes like x, y, cx, cy etc, but it requires a CSS-like transform, and also compensating with the cache.viewScale which is calculated based on the viewBox
		// ctm = getCTM(); // This would not work as expected since it also contains the external positioning/transforms of the root element
		
		ctm = getCTMIgnoreRoot(); // This method INCLUDES parent transforms, the only time we really need this is when we are moving an element to a different group <g>
		if (!ctm) {
			console.log('!ctm, ctm: ', ctm);
			el.setAttribute('transform', `translate(0, 0)`);
			ctm = getCTMIgnoreRoot();
			el.removeAttribute('transform');
		}

	} else {// NOTE: baseVal.consolidate() does not include anything else other than the CSS transform functions (unlike getCTM() which also combines the SVG attributes into it if a CSS-like transform is applied)
		ctm = m?.consolidate()?.matrix; // this method EXCLUDES parent transforms, also accounts for viewBox scaling (cache.viewScale), consolidate() will return null when no transform is set
	}

	if (!ctm) {
		return {
			x: 0,
			y: 0,
			// scaleX: 1,
			// scaleY: 1,
			matrix: ''
			// matrix: `matrix(1, 0, 0, 1, 0, 0)` // this is what a matrix with no transforms would look like
		};
	}

	return {
		x: ctm.e,
		y: ctm.f,
		// scaleX: Math.sqrt(ctm.a * ctm.a + ctm.b * ctm.b),
		// scaleY: Math.sqrt(ctm.c * ctm.c + ctm.d * ctm.d),
		matrix: `matrix(${ctm.a}, ${ctm.b}, ${ctm.c}, ${ctm.d}, 0, 0)` // include the other transformations but exclude the last two which are part of the translate
	}
}

var translateX = 0;
var translateY = 0;
var svg = {
	initial: {globalTrans: [0,0], translate: [0,0], parentTrans: [0,0], ancestorTransform: false},
	new: {translateDiff: [0, 0]},
	numID: 0, // each time a new element is added, the ID is incremented
	created: false,

	// when control key is pressed while resizing or moving, the element will be treated as generic and transformations will be applied to it instead
	resize: function (axis) { // resizing relies on no automatic selection area recalculating happening
		if (!element[this.type] || pressed.ctrlKey) // apply transformations on unsupported or non-standard elements
			this.type = 'genericElement';

		resize(this.initial, this.type);
	},
	move: function (direction) {
		if (!element[this.type] || pressed.ctrlKey)
			this.type = 'genericElement';

		move(this.initial, this.type);
		select.area(cache.ele);
	},  

	storeAttr: function () {
		this.initial = {globalTrans: [0, 0], translate: [0, 0], parentTrans: [0, 0], ancestorTransform: false}; // we reset the initial if no element is selected
		if (!cache.ele || !cache.ele[0]) return;
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

		let globalTranslate = [0, 0];
		let translate = [0, 0]; // default
		let scale = [1, 1];

		const parentTrans = getSVGTransform(cache.ele[0].parentElement, true);
		let ancestorTransform = parentTrans.x || parentTrans.y;

		const transform = getSVGTransform(cache.ele[0]);
		translate = [transform.x, transform.y];
		
		// const globalTransform = getSVGTransform(cache.ele[0], true);
		// globalTranslate = [globalTransform.x, globalTransform.y];
		globalTranslate = [parentTrans.x + transform.x, parentTrans.y + transform.y];

		let rotate = 0;

		let properties = { // first we get the width and height without transformations
			origWidth: cache.ele.width(),
			origHeight: cache.ele.height(),
			currWidth: cache.ele[0].getBoundingClientRect().width,
			currHeight: cache.ele[0].getBoundingClientRect().height
		}

		let newDim = [properties.currWidth, properties.currHeight];

		// getBBox does not account for transformations and gives axis-aligned bounding box for the element's local coordinate sytem
		const coord = [cache.ele[0].getBBox().x, cache.ele[0].getBBox().y];
		const dimension = [cache.ele[0].getBBox().width, cache.ele[0].getBBox().height];
		this.initial = { // Stores x, y, etc. values so that it can be accessed later to calculate transformations
			x: coord[0],
			y: coord[1],
			properties,
			width: dimension[0],
			height: dimension[1],
			right: coord[0] + dimension[0],
			bottom: coord[1] + dimension[1],
			matrix: transform.matrix,
			translate: translate,
			globalTrans: globalTranslate,
			parentTrans: [parentTrans.x, parentTrans.y],
			ancestorTransform: ancestorTransform,
			scale: scale,
			rotate: rotate,
			preScaleH: Math.abs(cache.origSelectArea.height - cache.origSelectArea.height / scale[1]),
			preScaleW: Math.abs(cache.origSelectArea.width - cache.origSelectArea.width / scale[0])
		}
		this.newScale = scale;
	},
	updateAttributes() { // this is needed for an element moved to another group, where we need to counteract the parent's transformations, which create their own local coordinate system
		// if an ancestor <g> element has a translation, then the child coordinates (i.e. x and y) will be relative to that element rather than the root <svg> element
		// without any ancestor transforms, the local coordinate system is relative to the root <svg>, otherwise the coordinate system of a child is relative to the transformed ancestor
		if (!cache.ele) return;
		console.log("cache.viewScale", cache.viewScale);
		const transform = getSVGTransform(cache.ele[0]);
		const parent = cache.ele[0].parentElement;
		const parentTrans = getSVGTransform(parent, true);
		let newTrans = transform.matrix ? [transform.x, transform.y] : [0,0]; // keep the existing transform if it exists, else return
		if (!svg.prevParent) return;
		
		if (!$(svg.prevParent).is($(parent))) {
				// we will compare the previous parent offset with the current parent offset, and subtract the difference
				// the calculations in getSVGTransform() automcatically include viewbox/viewport scaling
				let diffX = (getSVGTransform(svg.prevParent, true).x - parentTrans.x);
				let diffY = (getSVGTransform(svg.prevParent, true).y - parentTrans.y);
				newTrans = [(transform.x + diffX), (transform.y + diffY)];
		}

		cache.ele.attr({
			'transform': `translate(${newTrans[0]},${newTrans[1]}) ${transform.matrix}`,
		});
	},
	previewMove: function (transX, transY) {
		var x1 = this.initial.x + this.initial.globalTrans[0] + this.initial.width / 2;
		var y1 = this.initial.y + this.initial.globalTrans[1] + this.initial.height / 2;
		
		let x2 = x1 + transX;
		let y2 = y1 + transY;

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

export { svg, element, getSVGTransform };