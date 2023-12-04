import { Export } from "./Export.js";
import {doc} from "../../SetUp.js";

$('[aria-label="export"]').click(function() {
	var content = $('#editor')[0].outerHTML; // outerHTML includes the parent tag selected as well as children elements
	
	var fileName = prompt("What would you like to name your SVG file?\n");
	fileName += '.svg';
	Export(content, fileName, SVGUnitTypes);
})