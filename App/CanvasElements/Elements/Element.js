import { drag } from "../../Cache.js";

//** This will be extended by all SVG Element Types */
/**
 * This Class and Sub-classes will contain properties of an
 * element and some calculation logic corresponding to the element.
 * 
 * This Class and Sub-classes should not contain any [$jQuery] events
 */

class Element {
	static selectionArea;

	/**
	 * The constructor of each Element should contain the logic 
	 * associated with creating that Object on the SVG Editor.
	 * 
	 * //** If this constructor will have logic, it will only be after the user is completely done drawing an Element
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
		return selectionArea.width;
	}

	getHeight(ele) {
		return selectionArea.height;
	}

	getX(ele) {
		return selectionArea.x;
	}

	getXright(ele) {
		return selectionArea.xRight;
	}

	getY(ele) {
		return selectionArea.y;
	}

	getYbottom(ele) {
		return selectionArea.yBottom;
	}

	/**
	 * This will help create the blue selection overlay for resizing
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

export { Element, drag }