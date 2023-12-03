import { Export } from "../Export.js";

$('[aria-label="export"]').click(function() {
	console.log("export pressed");
	Export();
	// do your export logic here
})