import { cache, pressed } from "../Cache.js";

import { ui } from "../UI.js";


var select = {
	area: function(ele) {
		var area = {
			x: cache.stop[0] > cache.start[0] ? cache.start[0] : cache.stop[0],
			y: cache.stop[1] > cache.start[1] ? cache.start[1] : cache.stop[1],
			width: cache.stop[0] > cache.start[0] ? cache.stop[0] - cache.start[0] : cache.start[0] - cache.stop[0],
			height: cache.stop[1] > cache.start[1] ? cache.stop[1] - cache.start[1] : cache.start[1] - cache.stop[1]
		}
		ui.resizeHandles(false);
		if (ele) { // This checks that ele is NOT undefined or null
			area = {
				x: ele[0].getBoundingClientRect().x,
				y: ele[0].getBoundingClientRect().y,
				width: ele[0].getBoundingClientRect().width,
				height: ele[0].getBoundingClientRect().height
			}
			ui.resizeHandles(true); // show the resizing handles for resizing element option
		}
		this.ui(area);
	},
	ui: function(area) {
		$('.selection').css({
			'left': area.x,
			'top': area.y,
			'width': area.width,
			'height': area.height,
			'display': 'block' // Show the selection area in case it was previously hidden
		});
	}
}

export { select }