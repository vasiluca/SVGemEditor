//** These tests will run after an Ellipse is created */
import { cache } from "../Cache.js";

var test = {
	ellipse: function() {
		test("ry attribute of an Ellipse cannot be negative", () => {
			if (cache.ele.attr("ry") < 0) {
				throw new Error("Y-Radius of ellipse cannot be negative.");
			}
		});

		test("rx attribute of an Ellipse cannot be negative", () => {
			if (cache.ele.attr("rx") < 0) {
				throw new Error("X-Radius of ellipse cannot be negative.");
			}
		});
	}
}

export { test }