import { Export } from "../Export.js";
import {doc} from "../../SetUp.js";

$('[aria-label="export"]').click(function() {
	
	console.log("export pressed");
	fileName = prompt("What would you like to name your file?\n");
	Export(doc, fileNmae, SVGUnitTypes);
	// do your export logic here
})