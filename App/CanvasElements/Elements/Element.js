//** This will be extended by all Elements since their attributes need to b */
 /*
 
 */

class Element {
	#width;
	#height;
	#x;
	#xRight;
	#y;
	#yBottom;

	Element(ele) {
		this.width = ele[0].getBoundingClientRect().width;
		this.height = ele[0].getBoundingClientRect().height;
		this.x = ele[0].getBoundingClientRect().left;
		this.xRight = ele[0].getBoundingClientRect().right;
		this.y = ele[0].getBoundingClientRect().top;
		this.yBottom = ele[0].getBoundingClientRect().bottom;
	}

	/**
	 * This function will return attribute variables values stored in subclasses.
	 * 
	 * @param {String} name 
	 * @returns Number or String
	 */
	getAttr(name) {
		return this['#'+name];
	}

	getWidth(ele) {
		return width;
	}

	getHeight(ele) {
		return height;
	}

	getX(ele) {
		return x;
	}

	getXright(ele) {
		return xRight;
	}

	getY(ele) {
		return y;
	}

	getYbottom(ele) {
		return yBottom;
	}

	/**
	 * This will create the blue selection overlay for resizing
	 * @param {} ele 
	 */
	select(ele) {

	}
}