//** Functions related to creating new SVG Elements will go here */

import { cache } from '../../Cache.js';
import { tool } from '../../Tab/Tool.js';

import { test } from '../../Tests/createEle.test.js';
import { element } from './SVG.js';

var newSVG = {
	// TODO: In the future will need to get the highest ID elements in an opened existing SVG to set numID to
	numID: 0, // this will increment each time an element is created in order to give each element a unique ID
	id: '#0',

	creating: false, // indicates that the user moused-down and might drag to create an element
	finished: false,

	// TODO: Split up events (mousedown from mouse dragging) so that the check for this.created is not needed
	create(type, id) {
		
		if (!id) {
			id = this.numID;
			this.numID++;
		}
		// the below code simply append to the HTML Document
		$('#editor').html($('#editor').html() + '<' + type + ' id=' + id + '/>');
		this.id = '#' + id;
		cache.ele = id;

		//** run the test on the specific type of element created, make sure attributes valid */
		test[type]; 
	}
	
}

export { newSVG };