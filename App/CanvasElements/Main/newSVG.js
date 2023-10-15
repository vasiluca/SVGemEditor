//** Functions related to creating new SVG Elements will go here */

import { Line } from '../Elements/Element/Line.js';
import { Circle } from '../Elements/Element/Circle.js';
import { Ellipse } from '../Elements/Element/Ellipse.js';
import { Rectangle } from '../Elements/Element/Rectangle.js';

import { cache } from '../../Cache.js';
import { tool } from '../../Tab/Tool.js';

var newSVG = {
	// TODO: In the future will need to get the highest ID elements in an opened existing SVG to set numID to
	numID: 0, // this will increment each time an element is created in order to give each element a unique ID
	id: '#0',

	created: false,
	finished: false,

	//** This gives us easy access to Element Object functions, without requiring us to use a switch statement */
	//** This is because JavaScript allows us to access object properties using this syntax:  Obj["key"] */
	//** Which means we can pass in the object property we want to access as a String */
	// Each of these type keys on the left should match the name given to the SVG element tags
	type: {
		line: new Line(),
		circle: new Circle(),
		ellipse: new Ellipse(),
		rect: new Rectangle()
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
		// TODO: Perhaps Syntax similar to OOP can be used, but its unclear to what extent there will be true OOP
		let attr = this.type[type].createAttr(); // this will set the proper attributes based on the element type being created
		
		// after the element was created, we will also want to update certain attributes related to its property
		attr['stroke-width'] = tool.strokeWidth;
		attr.stroke = tool.stroke;

		if (type != 'line' && type != 'polyline') {
			attr['fill'] = tool.fill; // use the last color that was used for the fill color
			attr['paint-order'] = tool.paintOrder;
		}

		$(this.id).attr(attr);
	}
	
}

export { newSVG };