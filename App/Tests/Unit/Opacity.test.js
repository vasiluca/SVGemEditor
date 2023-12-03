import { cache } from "../../Cache.js";

var test = {
	setOpacity: function() {
		test("Changing Opacity Level", () => {
			this.setOpacity();
            var opacity = cache.ele.css('opacity');
			this.setOpacity();
			var new_opacity = cache.ele.css('opacity');
			if (opacity == new_opacity){
				throw new Error("Opacity Not Changed");
			}
		});
	}
}

export { test }