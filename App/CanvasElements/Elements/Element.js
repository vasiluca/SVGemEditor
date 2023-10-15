//** This will be extended by all SVG Element Types */
/**
 * This Class and Sub-classes will contain properties of an
 * element and some calculation logic corresponding to the element.
 * 
 * This Class and Sub-classes should not contain any [$jQuery] events
 */

class Element {
	selectionArea;

	/**
	 * The constructor of each Element should contain the logic 
	 * associated with creating that Object on the SVG Editor
	 * 
	 * @param {} ele 
	 */
	constructor() {
		
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
		selectionArea.width = ele[0].getBoundingClientRect().width;
		selectionArea.height = ele[0].getBoundingClientRect().height;
		selectionArea.x = ele[0].getBoundingClientRect().left;
		selectionArea.xRight = ele[0].getBoundingClientRect().right;
		selectionArea.y = ele[0].getBoundingClientRect().top;
		selectionArea.yBottom = ele[0].getBoundingClientRect().bottom;
	}
}

export { Element }