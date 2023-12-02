import { cache, pressed } from "../../../Cache.js";

import { doc } from "../../../SetUp.js";

import { svg, element } from "../SVG.js";
import { select } from "../../Selection.js";

var xLi, xRi, yTi, yBi; // the original values will be stored in these vars

var resize = function (initial, type) {
	var selection = $('.selection')[0].getBoundingClientRect();
	var rightHandle = pressed.handle.includes('right'); // Check if a handle on the right is being pressed
	var bottomHandle = pressed.handle.includes('bottom'); // Check if a handle on the bottom is being pressed
	var topHandle = pressed.handle.includes('top');
	var leftHandle = pressed.handle.includes('left');
	var selectW, selectH;
	// These two lines for translations are only for compensating for Zoom on the Canvas
	var translateX = (selection.width - cache.origSelectArea.width) / initial.scale[0] / doc.zoom;
	var translateY = (selection.height - cache.origSelectArea.height) / initial.scale[1] / doc.zoom;

	// Set the cache area for easily generating new element attribues
	var leftX = cache.ele[0].getBoundingClientRect().left;
	var rightX = cache.ele[0].getBoundingClientRect().right;
	var topY = cache.ele[0].getBoundingClientRect().top;
	var bottomY = cache.ele[0].getBoundingClientRect().bottom;

	// var initialW = cache.ele[0].getBou;

	if (leftHandle) {
		selectW = rightX - cache.stop[0];
		if (selectW <= 0) selectW = 0;

		leftX = rightX - selectW;
	}

	if (rightHandle) {
		selectW = cache.stop[0] - leftX;
		if (selectW <= 0) selectW = 0;

		rightX = leftX + selectW;
	}


	if (topHandle) {
		selectH = bottomY - cache.stop[1];
		if (selectH <= 0) selectH = 0;

		topY = bottomY - selectH;
	}

	if (bottomHandle) {
		selectH = cache.stop[1] - topY;
		if (selectH <= 0) selectH = 0;

		bottomY = topY + selectH;
	}

	cache.start[0] = leftX;
	cache.stop[0] = rightX;

	cache.start[1] = topY;
	cache.stop[1] = bottomY;

	if (svg.type == 'line') { // for some shapes it does matter whether they are drawn left-top to right-bottom or left-bottom to right-top
		if (svg.line.x1 > svg.line.x2) {
			var temp = cache.start[0];
			cache.start[0] = cache.stop[0];
			cache.stop[0] = temp;
		}
		if (svg.line.y1 > svg.line.y2) {
			var temp = cache.start[1];
			cache.start[1] = cache.stop[1];
			cache.stop[1] = temp;
		}
	}

	var attr = element[type].createAttr();

	cache.ele.attr(attr);
	select.area();


	if (pressed.altKey) { // alt is the same as Option key on Mac
		// if (bottomHandle) {
		// 	var heightDiff = cache.stop[1] - (cache.origSelectArea.y + cache.origSelectArea.height);
		// 	if (heightDiff == 0) {
		// 		heightDiff = 1;
		// 	}

		// 	svg.newScale[1] = selection.height / initial.preScaleH / doc.zoom;
		// }

		// if (rightHandle) {
		// 	var widthDiff = cache.stop[0] - (cache.origSelectArea.x + cache.origSelectArea.width);

		// 	if (widthDiff == 0) {
		// 		widthDiff = 1;
		// 	}

		// 	svg.newScale[0] = selection.width / initial.preScaleW / doc.zoom;
		// }
		// cache.ele.attr({
		// 	'transform': 'scale(' + svg.newScale[0] + ',' + svg.newScale[1] + ') ' +
		// 		'translate(' + 0 + ',' + 0 + ')'
		// });
	} else {
		if (pressed.shiftKey) {
			var ratioX = Math.abs(initial.height / initial.width);
			var ratioY = Math.abs(initial.width / initial.height);
			if (pressed.handle != 'bottom-handle' && pressed.handle != 'top-handle') {
				translateY = translateX * ratioX;
				$('.selection').css({
					'height': cache.ele[0].getBoundingClientRect().height,
					'top': cache.ele[0].getBoundingClientRect().top
				});
			} else {
				translateX = translateY * ratioY;
				$('.selection').css({
					'width': cache.ele[0].getBoundingClientRect().width,
					'left': cache.ele[0].getBoundingClientRect().left
				});
			}
			/*$('.selection').css({
				'width': cache.ele[0].getBoundingClientRect().width,
				'left': cache.ele[0].getBoundingClientRect().left
			});*/
			//console.log("Shift key is pressed");
		}

		// switch (svg.type) {
		// 	case 'line':
		// 		var x1 = svg.line.x1;
		// 		var x2 = svg.line.x2;
		// 		var y1 = svg.line.y1;
		// 		var y2 = svg.line.y2;
		// 		if (rightHandle) {
		// 			svg.line.x2 > svg.line.x1 ? x2 = svg.line.x2 + translateX : x1 = svg.line.x1 + translateX;
		// 		}
		// 		if (bottomHandle) {
		// 			svg.line.y2 > svg.line.y1 ? y2 = svg.line.y2 + translateX : y1 = svg.line.y1 + translateX;
		// 		}
		// 		if (topHandle) {
		// 			svg.line.y1 < svg.line.y2 ? y1 = svg.line.y1 - translateX : y2 = svg.line.y2 - translateX;
		// 		}
		// 		if (leftHandle) {
		// 			svg.line.x1 < svg.line.x2 ? x1 = svg.line.x1 - translateX : x2 = svg.line.x2 - translateX;
		// 		}
		// 		cache.ele.attr({
		// 			'x1': x1,
		// 			'x2': x2,
		// 			'y1': y1,
		// 			'y2': y2
		// 		});
		// 		break;
	// }
		// 	case 'rect':
		// 		var width = svg.rect.width;
		// 		var height = svg.rect.height;
		// 		var x = svg.rect.x;
		// 		var y = svg.rect.y;
		// 		if (rightHandle) {
		// 			if (pressed.cmdKey) {
		// 				x = x - translateX;
		// 				width = width + translateX * 2;
		// 			} else {
		// 				width = width + translateX;
		// 			}
		// 		}
		// 		if (bottomHandle) {
		// 			if (pressed.cmdKey) {
		// 				y = y - translateY;
		// 				height = height + translateY * 2;
		// 			} else {
		// 				height = height + translateY;
		// 			}
		// 		}
		// 		if (topHandle) {
		// 				if (pressed.cmdKey) {
		// 					y = y - translateY;
		// 					height = height + translateY * 2;
		// 				} else {
		// 					height = height + translateY;
		// 					y = y - translateY;
		// 				}
		// 			}
		// 			if (leftHandle) {
		// 				if (pressed.cmdKey) {
		// 					x = x - translateX;
		// 					width = width + translateX * 2;
		// 				} else {
		// 					width = svg.rect.width + translateX;
		// 					x = svg.rect.x - translateX;
		// 				}
		// 			}
		// 			width < 1 ? width = 1 : null;
		// 			height < 1 ? height = 1 : null;
		// 			cache.ele.attr({
		// 				'x': x,
		// 				'y': y,
		// 				'width': width,
		// 				'height': height
		// 			});
		// 			break;
		// 		case 'ellipse':
		// 			var cx = svg.ellipse.cx;
		// 			var cy = svg.ellipse.cy;
		// 			var rx = svg.ellipse.rx;
		// 			var ry = svg.ellipse.ry;
		// 			if (rightHandle) {
		// 				if (pressed.cmdKey) {
		// 					rx = rx + translateX;
		// 				} else {
		// 					rx = rx + translateX / 2;
		// 					cx = cx + translateX / 2;
		// 				}

		// 			}
		// 			if (bottomHandle) {
		// 				if (pressed.cmdKey) {
		// 					ry = ry + translateY;
		// 				} else {
		// 					ry = ry + translateY / 2;
		// 					cy = cy + translateY / 2;
		// 				}
		// 			}
		// 			if (topHandle) {
		// 				if (pressed.cmdKey) {
		// 					ry = ry + translateY;
		// 				} else {
		// 					ry = ry + translateY / 2;
		// 					cy = cy - translateY / 2;
		// 				}
		// 			}
		// 			if (leftHandle) {
		// 				if (pressed.cmdKey) {
		// 					rx = rx + translateX;
		// 				} else {
		// 					rx = rx + translateX / 2;
		// 					cx = cx - translateX / 2;
		// 				}
		// 			}
		// 			//rx < 1 ? rx = 1 : null;
		// 			//ry < 1 ? ry = 1 : null;
		// 			cache.ele.attr({
		// 				'rx': rx,
		// 				'ry': ry,
		// 				'cx': cx,
		// 				'cy': cy
		// 			});
		// 			break;
		// 		case 'circle':
		// 			if (!pressed.shiftKey) {
		// 				var elementID = cache.ele.attr('id');
		// 				var radius = parseFloat(cache.ele.attr('r'));
		// 				element.attr({
		// 					'rx': radius,
		// 					'ry': radius
		// 				});
		// 				var index = cache.ele.index();
		// 				cache.ele.remove();
		// 				svg.new('ellipse', element.attr(), elementID).eq(index);
		// 			}

		// }
	}
}

export { resize }