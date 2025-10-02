import { select } from '../../Selection.js';

import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';
import { newSVG } from '../../Modify/newSVG.js';

// import * as TextBox from '../../../Tab/Tool/TextBox.js';
import { TextContent } from '../../../Tab/Tool/TextBoxEvents.js'

class Text extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		var attr = {
			'x': drag.start[0],
			'y': drag.end[1],
			// 'contenteditable': 'plaintext-only',
			'font-size': '22px',
			'paint-order': 'stroke' // This will prevent stroke/outline from covering the actual text [fill]
			
		};

		let diffX = drag.end[0] - drag.start[0];
		if (diffX < 0) {
			diffX = '0'; // the default value is 0, which causes the text to render at its natural length
		}
		attr['textLength'] = diffX;

		if (cache.ele.html() == '') { // if the element HTML is non-existent, show New Text
			cache.ele.html('&nbsp; Text &nbsp;');
			cache.ele.attr('data-temp', 'true');  // indicate the text is placeholder in this text element, to be overridden
		}

		cache.mapKeysTo = 'text';

		return attr;
	}
}

export { Text }