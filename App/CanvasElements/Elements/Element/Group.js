import { Element, drag } from '../Element.js';

import { cache } from '../../../Cache.js';

class Group extends Element {
	constructor() {
		super(); // super must be always be called in a Sub-Class in JavaScript
		// This constructor might be used in the future, although it's not guaranteed
	}

	static createAttr() {
		
	}

	static parseAttr(ele) {
		
	}
}

export { Group }