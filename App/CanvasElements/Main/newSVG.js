//** Functions related to creating new SVG Elements will go here */

import { cache } from '../../Cache.js';
import { tool } from '../../Tab/Tool.js';

import { test } from '../../Tests/createEle.test.js';
import { element } from './SVG.js';

var newSVG = {
	// TODO: In the future will need to get the highest ID elements in an opened existing SVG to set numID to
	numID: 0, // this will increment each time an element is created in order to give each element a unique ID
	id: '#0',

	created: false,
	finished: false,

	// TODO: Split up events (mousedown from mouse dragging) so that the check for this.created is not needed
	create(type, id) {
		// this checks that the element was not created yet before appending, so this first if block runs once
		if (this.created == false) { // this if block prevents the element from being appended/created twice
			if (!id) {
				id = this.numID;
				this.numID++;
			}
			// the below code simply append to the HTML Document
			$('#editor').html($('#editor').html() + '<' + type + ' id=' + id + '/>');
			this.id = '#' + id;
			cache.ele = id;
			
			this.created = true;
			this.finished = false;
		}

		//** run the test on the specific type of element created, make sure attributes valid */
		test[type]; 
	}
	
}

export { newSVG };