import { Element } from '../Element.js';

import { cache } from '../../../Cache.js';
import { newSVG } from '../../Modify/newSVG.js';

import * as TextBox from '../../../Tab/Tool/TextBox.js';

class Text extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var attr = {
			'x': cache.start[0],
			'y': cache.start[1],
			'contenteditable': true
		};

		if (cache.stop[0] != cache.start[0]) {
			if (cache.stop[0] < cache.start[0]) {
				var temp = cache.start[0];
				cache.start[0] = cache.stop[0];
				cache.stop[0] = temp;
			} 

			attr['textLength'] = cache.stop[0] - cache.start[0];
		}

		// cache.ele.html('My Text');

		// TextBox.createTextbox();

		return attr;
	}
}

export { Text }