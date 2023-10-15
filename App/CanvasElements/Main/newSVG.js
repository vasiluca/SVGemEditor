//** Functions related to creating new SVG Elements will go here */

import { cache } from '../../Cache.js';

import { Line } from '../Elements/Element/Line.js';
import { tool } from '../../Tab/Tool.js';

var newSVG = {
	// TODO: In the future will need to get the highest ID elements in an opened existing SVG to set numID to
	numID: 0, // this will increment each time an element is created in order to give each element a unique ID
	id: '#0',

	created: false,
	finished: false,

	//** This gives us easy access to Element Object functions, without requiring us to use a switch statement */
	//** This is because JavaScript allows us to access object properties using this syntax: Obj["key"] */
	//** Which means we can pass in the object property we want to access as a String */
	element: {
		line: new Line()
		// ,
		// circle: new Circle(),
		// ellipse: new Ellipse(),
		// rectangle: new Rectangle()
	},

	// constructor(height) {
	// 	this.height = 0;
	// }

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
		this.element['line'] = new Line(); // TODO: This raises the question as to whether Object-Oriented Programming should be used

		let attr = this.element[type]; // this will set the proper attributes based on the element type being created
		
		// after the element was created, we will also want to update certain attributes related to its property
		attr['stroke-width'] = tool.strokeWidth;
		attr.stroke = tool.stroke;

		if (type != 'line' && type != 'polyline') {
			attr['paint-order'] = tool.paintOrder;
		}

		$(this.id).attr(attr);
	}
	
}

export { newSVG };