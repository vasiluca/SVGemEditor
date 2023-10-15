//** These tests will run after a document is created */

function runTest() {
	test(" ...Width of newly created DOCUMENT... cannot be negative", () => {
		if($("editor").attr("height") < 0){
			throw new Error("Width of SVG Document cannot be negative");
		}
	});

	test("document cannot have a negative height", () => {
		if ($("editor").attr("height") < 0) {
			throw new Error("Height of SVG Document cannot be negative");
		}
	});
}