/** This contains all functions pertaining to the Layers Tab */

import { cache } from '../Cache.js';
import { newSVG } from '../CanvasElements/Modify/newSVG.js';
import { svg, getSVGTransform } from '../CanvasElements/Modify/SVG.js';
import { select } from '../CanvasElements/Selection.js';
import { doc } from '../SetUp.js';

import { colors } from './Color.js';

import { deleteButton } from './Property/DeleteButton.js';

// getCoord(el) does not account for transformations on any parent <g> element(s), but accounts for transforms on the current element
// However getCoord() is much more robust than simply calling getBBox on an element, since it would not account for transformations at all
function getCoord(el) {
	// let transform = getSVGTransform(el.parentElement); // we check for a global transform, but for getCoord() we must return local single element transform
	try {
		let globalTransform = getSVGTransform(el.parentElement, true);
		let transform = getSVGTransform(el.parentElement);

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

		let pos = point; // point stores values for x and y

		pos = {
			x: (pos.x) / globalTransform.scaleX,
			y: (pos.y) / globalTransform.scaleY,
			other: globalTransform,
			local: transform
		};

		return pos;
	} catch (e) {
		return {
			x: 0,
			y: 0,
			other: {
				x: 0,
				y: 0
			},
			local: {
				x: 0,
				y: 0
			}
		};
	}
    
}

function checkID(id) {
	let idNum = Number.parseInt(id); idNum = Number.isNaN(idNum) ? -1 : idNum;
	if (idNum >= newSVG.numID) {
		newSVG.numID = idNum + 1; // This ensures that imported files have proper element numbering by preventing duplicate IDs
	}
}

function prop(el, name) { // will check the rendered property of an element
	// console.log(this);
	if (!el[0]) return;
	let val = window.getComputedStyle(el[0]).getPropertyValue(name);
	if (!val || val === 'rgba(0, 0, 0, 0)' || val === 'transparent') {
		return '';
	}
	return val;
}

//* This function accounts for parent transformation through parentTrans and current element transform while getCoord only accounts for current element transformation
function getCoordAbsolute(ele, parentTrans) {
	// NOTE: no longer using parentTrans (currently coordinates are being added up separately between each parent and child - TODO: refactor)

	// NOTE: For every element (group) with a transform, we return its entire transformed position since each group is in its own <svg> tag in the layers tab
	// We only track the transforms on the group elements which have them, since we are also using get coord to track child element transforms
	// We need the coordinates of the transformed ancestors, since each child as a layer lacks any of the parent contexts
	// const transform = ele.attr('transform') || ele.css('transform');
	let transform = getSVGTransform(ele[0], true);
	if (transform.x || transform.y) {
		transform = getSVGTransform(ele[0], true);
		let moveX = transform.x/transform.scaleX;
		let moveY = transform.y/transform.scaleY;
		parentTrans = [moveX, moveY];
	}

	return parentTrans;
}

var preview; // including the variable outside the layers object seems to help in preventing glitches when moving layers
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
			
		
		if (!child) colors.picker = []; // we will only reset the picker stored colors if all the layers are looped through again starting from the top
		for (var i = element.children().length-1; i >= 0; i--) { // This loops through all of the SVG layers and renders them in the layers tab
			// TODO: Add a check for display: none, in which case the display property will be removed and replaced with a 'visibility: hidden' property
			var data = {
				html: element.children().eq(i)[0].outerHTML,
				type: element.children().eq(i)[0].tagName.toLowerCase(),
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
					data.type == 'line' || data.type == 'path' || data.type == 'polyline' || data.type == 'polygon' || data.type == 'g' || data.type == 'text' || data.type == 'image' && ele[0]) {
					let div;
					// if (!(data.type == 'g' && ele.children().length === 1 && ele.children().eq(0).children().length === 0)) { // avoid including a single element twice
						
					var stroke = ele.attr('stroke-width');
					stroke = stroke ? Number.parseFloat(stroke) : 0;

					let coord = getCoord(ele[0]); // with coord.other.scale we can prevent the parent scaling from affecting the bounding rectange of the element's own transform
					var width = ele[0].getBoundingClientRect().width/doc.zoom/coord.other.scaleX/doc.viewScale[0]/doc.scaleFit[0] + stroke / 2 * 2;
					var height = ele[0].getBoundingClientRect().height/doc.zoom/coord.other.scaleY/doc.viewScale[1]/doc.scaleFit[1] + stroke / 2 * 2;

					// getCoord returns the position of any element, but only accounts for the style transformations on the current element, not including parent
					var transX = -coord.x + stroke / 2; //+ coord.other.scale[0];
					var transY = -coord.y + stroke / 2; //+ coord.other.scale[1];

					// getCoord actually accounts for all ancestor transformations
					// however, we are adding each element individually without its parent transformations (in layers tab)
					// so we need to re-apply the parent's translations in order for the child to be positioned as expected
					// though technically, we could just ignore all child and ancestor transforms and simply use an element's coordinates while counter-acting their own transform
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

					fillColor = window.getComputedStyle(ele[0]).getPropertyValue('fill').replace(/\s*,\s*/g, ',');
					strokeColor = window.getComputedStyle(ele[0]).getPropertyValue('stroke').replace(/\s*,\s*/g, ',');
					CSS.supports('background', strokeColor) ? colors.push('picker', strokeColor) : null;
					CSS.supports('background', fillColor) ? colors.push('picker', fillColor) : null;

					$(preview).attr({
						// 'transform': (parentTrans ? parentTrans : '') + ' translate(' + transX + ',' + transY + ')'
						'transform': ' translate(' + transX + ',' + transY + ')',
						// 'transform-origin': '0 0'
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

				} else { // we will create a placeholder for an element (like defs) so that the layers and canvas item indexes align (this will prevent bugs)
					const span = document.createElement('span');
					if (child) {
						document.querySelector('.layers .all section#group-' + groupNum).appendChild(span);
					} else {
						document.querySelector('.layers .all').appendChild(span);
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
		const parent = cache.ele[0].parentElement;
		parent.appendChild(cache.ele[0]);
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
		const parent = cache.ele[0].parentElement;
		parent.prepend(cache.ele[0]);
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
	svg.prevParent = $('#editor #' + layers.current.attr('id'))[0].parentElement; // we need this to check if the user moved an element up the DOM tree, in which case a different transformation calculation must be done
	svg.storeAttr();
	svg.prev = {...svg.initial}; // store the previous data on the element as a non-reference copy of the current state
	
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
		const moving = $('#editor #' + layers.current.attr('id'))[0];
		const refHover = $('#editor #' + layer.attr('id'))[0];

		const parentGroup = refHover.parentElement;
		const prevGroup = moving.parentElement;
		if (layer.hasClass('drop-above')) {
			layers.current.detach().insertBefore(layer);
			$('#editor #' + layers.current.attr('id')).detach().insertAfter($('#editor #' + layer.attr('id')));

		} else if (layer.hasClass('drop-below')) {
			layers.current.detach().insertAfter(layer); // insertAfter on this line and below are different because layers are show bottom to top in layers preview

			$('#editor #' + layers.current.attr('id')).detach().insertBefore($('#editor #' + layer.attr('id')));
		} else if (layer.hasClass('drop-group')) {
			let svgDoc = document.getElementById('editor');
			let group;
			if (refHover.tagName.toLowerCase() !== 'g') { // prevent creation of un-intended double-groups by checking if the object being hovered is not a group
				// use SVG API instead
				
				if (parentGroup) // use the hovering element's parent in order to use inserBefore
					svgDoc = parentGroup;

				const svgNS = "http://www.w3.org/2000/svg";
				group = document.createElementNS(svgNS, 'g');
				
				group.setAttribute('data-svgem', layers.group); // sets the new group to the available group number
				
				svgDoc.insertBefore(group, refHover); // insert group before refHover (layer[0]) being hovered
				group.prepend(moving);
				group.prepend(refHover);
			} else if (refHover.tagName.toLowerCase() === 'g') {
				if (prevGroup === refHover) return; // prevent dropping an element into a group it is already in (even though this should not normally cause issues)
				group = refHover; // in this case use the <g> as a parent to insert into
				
				group.prepend(moving);
				if (!group.getAttribute('data-svgem')) {
					group.setAttribute('data-svgem', layers.group); // set an available group number
				}
			} else if (moving.tagName.toLowerCase() === 'g' && moving.childElementCount === 1) { // there may groups with single elements, which should do not show up as group in the GUI interface
				if (parentGroup)
					svgDoc = parentGroup;

				group = moving; // in this case use the <g> as a parent to insert into

				svgDoc.insertBefore(group, refHover); // position the group just before where the hovered element is at

				group.prepend(refHover); // now actually move the hoveres element into the group

				if (!group.getAttribute('data-svgem')) {
					group.setAttribute('data-svgem', layers.group); // set an available group number
				}
			}
		}

		if (prevGroup.tagName.toLowerCase() === 'g' && prevGroup.childElementCount === 0) {
			prevGroup.remove(); // prevent empty <g> tags from accumulating
		}
		if (prevGroup.childElementCount === 1) {
			// prevGroup.removeAttribute('data-svgem');
		}
	}
	svg.updateAttributes();
	// layers.update ensures that elements without their own fill or stroke, inherit their parent <g> element colors in the layers tab
	layers.update(); // TODO: this can be made more efficient by detecting the group element into which an element was droppped and/or detecting if the preview fill/stroke is actually different from the parent color in the different group

	// TODO: need select.area because scaled items do not maintain their position when dropped into scaled groups (need to fix)
	// However, it is wise to keep select.area() here in case an object does not maintain its position when group/parent container is changed
	select.area(cache.ele); 
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