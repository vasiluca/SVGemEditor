//** Functions related to creating new SVG Elements will go here */

import { cache } from '../../Cache.js';
import { tool } from '../../Tab/Tool.js';

import { test } from '../../Tests/Unit/createEle.test.js';
import { select } from '../Selection.js';
import { element } from './SVG.js';
import { editSVG } from './editSVG.js';

var newSVG = {
	insertNextToGroup: true,
	// TODO: In the future will need to get the highest ID elements in an opened existing SVG to set numID to
	numID: 0, // this will increment each time an element is created in order to give each element a unique ID
	creating: false, // indicates that the user moused-down and might drag to create an element
	finished: false,

	create(type, id) {
		
		if (!id) {
			id = this.numID;
			this.numID++; // increment id for the next time it is accessed
		}
		
		// the below code simply append to the HTML Document
		if (cache.ele) {
			let parent = cache.ele[0].parentElement;
			const svgNS = "http://www.w3.org/2000/svg";
			const el = document.createElementNS(svgNS, type);
			el.setAttribute('id', id);

			if (this.insertNextToGroup || cache.ele[0].tagName.toLowerCase() !== 'g') { // insert before existing selected elements, including before selected <g> elements (if insert nextToGroup enabled)
				if (parent.tagName.toLowerCase() === 'g' && parent.childElementCount === 1) // do not draw to a group that does not show up as a group already (i.e. a <g> with a single child element)
					parent = parent.parentElement;

				// if the second parameter of insertBefore is null, then the element will simply be inserted at the end of the parent element
				parent.insertBefore(el, cache.ele[0].nextElementSibling); // insert the new element just after where the last selected element was (by accessing its next sibling)
			} else if (cache.ele[0].tagName.toLowerCase() === 'g') { // otherwise, insert the element into selected group if insertNextToGroup is disabled
				if (cache.ele.children().length > 1) {
					cache.ele.html(cache.ele.html() + '<' + type + ' id=' + id + '/>');
				} else {
					// if the current element is an individual element or is a group with a single child (does not show up as group in layers tab), then we insert the element like with a regular non-group element
					parent.insertBefore(el, cache.ele[0].nextElementSibling); // insert element before the next sibling of the current selected element
					// cache.ele = $(cache.ele[0].nextElementSibling.getAttribute('id'));
					// svg.storeAttr();
				}
				// TODO: The user will be able to configure insertNextToGroup setting in the future, this will require slight modification to ensure that the svg.initial data of the frontmost child of the group is used
				// Currently, all new elements are added in front of the current selected element whether group or not (this else-if block is currently ignored)
			} 
		} else
			$('#editor').html($('#editor').html() + '<' + type + ' id=' + id + '/>');

		cache.ele = id;

		editSVG.attrDefaults(type);

		//** run the test on the specific type of element created, make sure attributes valid */
		test[type];
	}
}

export { newSVG };