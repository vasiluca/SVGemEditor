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
			if (ele == true) {
				if (!pressed.shiftKey) {
					$('.outline').remove();
					$('.outline2').remove();
				}
				cache.hoverEle.clone().removeAttr('id').addClass('outline').insertBefore(cache.hoverEle);
				cache.hoverEle.clone().removeAttr('id').addClass('outline2').insertBefore($('.outline'));
				$('.outline').attr({
					'stroke': 'rgba(255,255,255,0.75)',
					'stroke-width': parseInt(cache.ele.attr('stroke-width')) + 3.5,
					'fill': 'transparent'
				});
				$('.outline2').attr({
					'stroke': 'cornflowerblue',
					'stroke-width': parseInt(cache.ele.attr('stroke-width')) + 7,
					'fill': 'transparent'
				});
			} else if (ele == false) {
				$('.outline').remove();
				$('.outline2').remove();
			} else {
				area = {
					x: ele[0].getBoundingClientRect().x,
					y: ele[0].getBoundingClientRect().y,
					width: ele[0].getBoundingClientRect().width,
					height: ele[0].getBoundingClientRect().height
				}
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