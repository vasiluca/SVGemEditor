import { cache, pressed } from "../Cache.js";

import { ui } from "../UI.js";


var select = {
	display: 'block',
	area: function(ele) {
		
		var area = {
			x: cache.stop[0] > cache.start[0] ? cache.start[0] : cache.stop[0],
			y: cache.stop[1] > cache.start[1] ? cache.start[1] : cache.stop[1],
			width: cache.stop[0] > cache.start[0] ? cache.stop[0] - cache.start[0] : cache.start[0] - cache.stop[0],
			height: cache.stop[1] > cache.start[1] ? cache.stop[1] - cache.start[1] : cache.start[1] - cache.stop[1]
		}
		
		if (ele) { // This checks that ele is NOT undefined or null
			area = {
				x: ele[0].getBoundingClientRect().x,
				y: ele[0].getBoundingClientRect().y,
				width: ele[0].getBoundingClientRect().width,
				height: ele[0].getBoundingClientRect().height
			}
			this.display = 'block';
			ui.resizeHandles(true); // show the resizing handles for resizing element option
			// layers.update();
		} else if (ele == undefined) { // Show selection area in drag mode
			this.display = 'block';
			ui.resizeHandles(false); // This gives th selection area a blue background, and no handles
		} else { // Ele is false, hide selection area (no element selected)
			$('.selection').removeClass('selecting');
			this.display = 'none';
		}
		this.ui(area);
	},
	ui: function(area) {
		$('.selection').css({
			'left': area.x,
			'top': area.y,
			'width': area.width,
			'height': area.height,
			'display': this.display // By default will show the selection area in case it was previously hidden
		});
	}
}

export { select }