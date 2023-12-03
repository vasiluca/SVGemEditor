import { cache, pressed } from "../Cache.js";


var select = {
	area: function(ele) {
		var area = {
			x: cache.stop[0] > cache.start[0] ? cache.start[0] : cache.stop[0],
			y: cache.stop[1] > cache.start[1] ? cache.start[1] : cache.stop[1],
			width: cache.stop[0] > cache.start[0] ? cache.stop[0] - cache.start[0] : cache.start[0] - cache.stop[0],
			height: cache.stop[1] > cache.start[1] ? cache.stop[1] - cache.start[1] : cache.start[1] - cache.stop[1]
		}
		if (ele != undefined) {
			area = {
				x: ele[0].getBoundingClientRect().x,
				y: ele[0].getBoundingClientRect().y,
				width: ele[0].getBoundingClientRect().width,
				height: ele[0].getBoundingClientRect().height
			}
		}
		this.ui(area);
	},
	ui: function(area) {
		$('.selection').css({
			'left': area.x,
			'top': area.y,
			'width': area.width,
			'height': area.height
		});
	}
}

export { select }