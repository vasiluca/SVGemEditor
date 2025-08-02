/** This contains all functions pertaining to the Layers Tab */

import { cache } from '../Cache.js';
import { newSVG } from '../CanvasElements/Modify/newSVG.js';
import { doc } from '../SetUp.js';

import { colors } from './Color.js';

import { deleteButton } from './Property/DeleteButton.js';

// getCoord(el) does not account for transformations on any parent <g> element(s)
// However getCoord() is much more robust than simply calling getBBox on an element, since it would not account for transformations at all
function getCoord(el) {
    const svg = document.querySelector('#editor');
    const bbox = el.getBBox();
    
    let point = svg.createSVGPoint();
    point.x = bbox.x;
    point.y = bbox.y;
    
    // Always use getCTM() (more reliable than getScreenCTM for SVG transformations)
    let ctm = el.getCTM();
    let svgCtm = svg.getCTM();
    
    // Always transform the point - don't make it conditional
    if (ctm && svgCtm) {
        point = point.matrixTransform(ctm);
        point = point.matrixTransform(svgCtm.inverse());
    }
    
    return point;
}

function checkID(id) {
	let idNum = Number.parseInt(id); idNum = Number.isNaN(idNum) ? -1 : idNum;
	if (idNum >= newSVG.numID) {
		newSVG.numID = idNum + 1; // This ensures that imported files have proper element numbering by preventing duplicate IDs
	}
}

function prop(el, name) { // will check the rendered property of an element
	// console.log(this);
	let val = window.getComputedStyle(el[0]).getPropertyValue(name);
	if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') {
		return '';
	}
	return val;
}

//* This function accounts for parent transformation while getCoord only accounts for single element transformation
function getCoordAbsolute(ele, parentTrans) {
	const transform = ele.attr('transform');
	if (transform && transform.trim().includes('translate')) {
		const translate = transform.match(/translate\s*\(\s*([^,\s]+)(?:\s*,\s*([^)]+))?\s*\)/); // match translate attr regardless where it is included
		var moveX = parseFloat(translate[1]);
		var moveY = parseFloat(translate[2] || 0);
		if (parentTrans) {
			parentTrans[0] += moveX;
			parentTrans[1] += moveY;
		} else
			parentTrans = [moveX, moveY];

		// parentTrans = parentTrans += ` translate(${transX},${transY})`;
	}

	return parentTrans;
}

var preview; // including the variable outside the layers object seems to help in preventing glitches when dragging layers
var layers = {
	groups: {},
	group: 0, // keeps track of number of group sections
	currGroup: 0,
	all: [],
	// TODO: Create another function to deal with updating existing element or adding one element, without re-rendering the entire layers tab list
	update: function(child, groupNum, parentTrans) {
		if (groupNum)
			document.querySelector('.layers .all section#group-' + groupNum).html('');
		else
			groupNum = this.currGroup;
		
		// NOTE: Do not use the display property to toggle hide elements, use visibility for proper functioning
		let element;
		let section; // element for grouping child elements
		if (child) {
			element = child;
		} else {
			element = $('#editor');
			$('.layers .all').html(''); // using empty() should help prevent the reference to the parent element .all from becoming invalid
		}
			
		
		colors.picker = [];
		for (var i = element.children().length-1; i >= 0; i--) { // This loops through all of the SVG layers and renders them in the layers tab
			// TODO: Add a check for display: none, in which case the display property will be removed and replaced with a 'visibility: hidden' property
			var data = {
				html: element.children().eq(i)[0].outerHTML,
				type: element.children().eq(i)[0].outerHTML.replace('<','').split(' ')[0].toLowerCase(),
				id: element.children().eq(i) ? element.children().eq(i).attr('id') : null,
				visibility: element.children().eq(i)[0].getAttribute('visibility')
			}
			checkID(data.id); // ensure we do not re-use an existing ID when creating an element

			var fillColor, strokeColor, stroke, target;
			let ele;
			let parent;
			let preview;
			
			if (data.id) { // Check that an ID exists (also note - previewMove() appends to the original SVG canvas to show the moving being locked by shift or CMD key)
				ele = $('#editor #' + data.id);
				parent = '.layers .all div[id="' + data.id + '"]';
				preview = '.layers .all div[id="' + data.id + '"] svg > g';
				
			} else {
				ele = element.children().eq(i);
				
				// parent = `.layers .all section#group-${groupNum} div:nth-child(element.children().length - (i)})`;
				// preview = `.layers .all section#group-${groupNum} div:nth-child(element.children().length - (i)}) svg > g`;
				// console.log(parent, preview);
			}
			// if (ele.attr('data-svgem')) {/* parse the group number and set this.group equal to it, while ensuring that the number is greater than the previous group num */}
			// if (data.id) { 
				

				if (data.type == 'circle' || data.type == 'ellipse' || data.type == 'rect' ||
					data.type == 'line' || data.type == 'path' || data.type == 'polygon' || data.type == 'g') {
					let div;
					// if (!(data.type == 'g' && ele.children().length === 1 && ele.children().eq(0).children().length === 0)) { // avoid including a single element twice
						
					var stroke = ele.attr('stroke-width');
					stroke = stroke ? Number.parseFloat(stroke) : 0;
					var width = ele[0].getBBox().width + stroke / 2 * 2;
					var height = ele[0].getBBox().height + stroke / 2 * 2;

					// getCoord returns the position of any element, but only accounts for the style transformations on the current element, not including parent
					var transX = -getCoord(ele[0]).x + stroke / 2;
					var transY = -getCoord(ele[0]).y + stroke / 2;
					// we have to account for the parent's translation since getCoord works in the relative local coordinate space
					if (parentTrans) {
						transX += parentTrans[0];
						transY += parentTrans[1];
					}

					div = document.createElement('div');
					data.id ? div.setAttribute('id', data.id) : null;
					const id = data.id ? `id=${data.id}` : '';

					div.innerHTML =
						'<svg ' + id + ' viewBox="0 0 ' + width + ' ' + height + '" height="50px" width="50px" preserveAspectRatio="xMidYMid meet"><g>' +
						data.html +
						'</g></svg>';

					if (child) {
						document.querySelector('.layers .all section#group-'+groupNum).appendChild(div);

						this.groups['group-' + groupNum][element.children().length - (i)] = element;
					} else {
						document.querySelector('.layers .all').appendChild(div);
					}
					// console.log($(parent));
					parent = div;
					preview = div.querySelector('svg > g');



					stroke = parseFloat($(target).attr('stroke-width'));
					// console.log($(preview).attr('fill'));
					if ($(preview).attr('fill')) {
						fillColor = $(preview).attr('fill').toUpperCase();
					} else {
						if (prop(element, 'fill')) { // check if parent element has fill
							$(preview).attr('fill', prop(element, 'fill'));

						}
						// fillColor = $(preview).css('fill').toUpperCase();
					}
					if ($(preview).attr('stroke')) {
						strokeColor = $(preview).attr('stroke').toUpperCase();
					} else {
						if (prop(element, 'stroke')) { // check if parent (<g>) element has stroke
							$(preview).attr('stroke', prop(element, 'stroke'));

						}
						// strokeColor = $(preview).css('stroke').toUpperCase();
					}

					if (data.visibility) {
						$(preview).attr('visibility', 'visible');
						$(parent).addClass('hidden');
					}

					if ($(preview).children().eq(0).attr('visibility')) {
						$(preview).children().eq(0).attr('visibility', 'visible');
					}

					if (cache.svgID === data.id) {
						$(parent).addClass('selected');
					}

					const hasSingleChild = ele.children().length === 1 && ele.children().eq(0).children().length === 0;
					
					// This is for ensuring that groups with a single element account for the child that is not traversed
					if (hasSingleChild) {
						const childEle = ele.children().eq(0);
						const childTrans = getCoordAbsolute(childEle, [transX, transY]);
						transX = childTrans[0];
						transY = childTrans[1];
					}

					strokeColor ? colors.push('picker', strokeColor) : null;
					fillColor ? colors.push('picker', fillColor) : null;

					$(preview).attr({
						// 'transform': (parentTrans ? parentTrans : '') + ' translate(' + transX + ',' + transY + ')'
						'transform': ' translate(' + transX + ',' + transY + ')'
					});
					$(preview).css({
						'transform': '',
						'matrix': ''
					});
					// }

					if (ele.children().length > 0) {
						if (hasSingleChild) { // this will apply to <g> elements which have exactly one-child and no grand-child
							const child = ele.children().eq(0);
							const childID = child.attr('id');
							if (childID)
								checkID(childID); // even though we do not display the element by itself, we must ensure we do not use its ID in the future

							continue; // avoid redundantly traversing a group element with a single child
						} else {
							this.group = this.group+1;
							this.currGroup = this.group;
							
							section = document.createElement('section');
							const groupID = 'group-' + this.group;
							section.setAttribute('id', groupID); // this id is treated separately from the div ID
							div.setAttribute('data-svgem', groupID); // this id is treated separately from the div ID

							this.groups[groupID] = [];

							div.appendChild(section); // prepare to allow the next div child layers to be appended to the corresponding section group
							// console.log(this.group, groupNum);
							element.children().eq(i)[0].setAttribute('data-svgem', groupID);
							div.classList.add('group');

							// groupNum = this.group;
						}
						
						// This will make sure the child accounts for the current parent's translation if there is one
						// getCoord only accounts for the transformation for the local coordinate space, ignoring the parent's
						const inheritTrans = getCoordAbsolute(ele, parentTrans);
						
						this.update(ele, false, inheritTrans);

						if (div) {
							this.currGroup -= 1; // go back a level since we are done recursing the children of an element
						}
						//section = document.querySelector('.layers .all section#group-' + groupNum); // reset the parent group element to the previous one from recursion
					}

				}
			// }
		}
		// console.log(cache.svgID);
		// console.log($('.layers .all div#' + cache.svgID).outerHTML);
		// $('.layers .all div#' + cache.svgID).addClass('selected');
		if ($('.draggable.layers')[0].getBoundingClientRect().height > $(document).height() - 100) {
			$('.draggable.layers .all').css('max-height', $(document).height() - 100);
		}

		$('.layers .all')[0].scrollTop = this.scroll;

		if (!child) { // reset the group number before beginning recursion from scratch
			this.group = 0;
			this.currGroup = 0;
		}
	},

	deleteSelected: function () {
        // Call deleteButton's handleDelete method
        deleteButton.handleDelete();

        // Update layers after deletion
        this.update();
    },

	moveUp: function(top) {
	if (top) {
		cache.ele.detach().appendTo('#editor');
	} else {
		var index = cache.ele.index();
		var nextEle = cache.ele.next();
		if (nextEle.length) {
			cache.ele.detach().insertAfter(nextEle);
		}
	}
	this.update();
	},
	moveBack: function(bottom) {
	if (bottom) {
		cache.ele.detach().prependTo('#editor');
	} else {
		var index = cache.ele.index();
		var prevEle = cache.ele.prev();
		if (prevEle.length) {
			cache.ele.detach().insertBefore(prevEle);
		}
	}
	this.update();
	},
	drop: function(layer) {
	if (layers.current.hasClass('selected') && $('.layers .selected').length > 1) {
		if (!layer.hasClass('selected')) {
			if (layer.hasClass('drop-above')) {
				$('.layers .selected').insertBefore(layer);
				$('.layers .selected').each(function() {
					$('#editor #' + $(this).attr('id')).detach().insertAfter($('#editor #' + layer.attr('id')));
				});
			} else if (layer.hasClass('drop-below')) {
				$('.layers .selected').insertAfter(layer);
				$('.layers .selected').each(function() {
					$('#editor #' + $(this).attr('id')).detach().insertBefore($('#editor #' + layer.attr('id')));
				});
			} else if (layer.hasClass('drop-group')) {

			}
		}

	} else if (layers.current.attr('id') != layer.attr('id')) {
		if (layer.hasClass('drop-above')) {
			layers.current.detach().insertBefore(layer);
			$('#editor #' + layers.current.attr('id')).detach().insertAfter($('#editor #' + layer.attr('id')));
		} else if (layer.hasClass('drop-below')) {
			layers.current.detach().insertAfter(layer); // insertAfter on this line and below are different because layers are show bottom to top in layers preview
			$('#editor #' + layers.current.attr('id')).detach().insertBefore($('#editor #' + layer.attr('id')));
		} else if (layer.hasClass('drop-group')) {

		}
	}
	// layers.update ensures that elements without their own fill or stroke, inherit their parent <g> element colors in the layers tab
	layers.update(); // TODO: this can be made more efficient by detecting the group element into which an element was droppped and/or detecting if the preview fill/stroke is actually different from the parent color in the different group
	//if ()

	/*if (layer.hasClass('drop-above')) {
		$('.layers .selected').each(function() {
		$('#editor ' + $(this).attr('id')).detach().index(layer.index());
		});
	} else if (layer.hasClass('drop-below')) {
		$('.layers .selected').each(function() {
		$('#editor ' + $(this).attr('id')).detach().index(layer.index() + 1);
		});
	} else {

	}*/

	}
}

export { layers };