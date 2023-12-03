import { cache, pressed } from "../../Cache.js";
import { tabStates } from "../../Tabs.js";
import { ui } from "../../UI.js";

import { tool } from "../Tool.js";
import { property } from "../Property.js";

$(document).mousedown(function (e) {
	if ($('.propertyScrubber').hasClass('show') && !$(e.target).is('.propertyScrubber, .propertyScrubber *')) {
		$('.propertyScrubber').removeClass('show');
	}
});

$('.properties div').click(function () {
	if (!$(this).attr('disabled') && $(this).is('[data-icon]')) {
		if (!$(this).is('[data-icon=""]')) {
			property.colorTo = $(this).attr('aria-label');
		}
		if (!$('.color').hasClass('expand')) {
			tabStates.color.expand(true);
			tabStates.color.quickView = true;
			tabStates.color.keepOpen = false;
		}
		if (!pressed.shiftKey) {
			if ($(this).is('[aria-label="stroke"], [aria-label="fill"]')) {
				$('.properties div[aria-label="stroke"], .properties div[aria-label="fill"]').removeClass('toggled');
			}
		}
		if ($(this).is('[aria-label="opacity"]')) {
			$(this).toggleClass('toggled');
		} else {
			$(this).addClass('toggled');
		}
	}
	if ($(this).is('[aria-label="stroke"], [aria-label="fill"]')) {
		if ($(this).hasClass('toggled')) {
			$('.properties div').removeClass('fill');
			$(this).addClass('fill');
		}
	} else if ($(this).is('[aria-label="gradient"], [aria-label="texture"]')) {
		$('.properties div').removeClass('fill');
		$(this).addClass('fill');
	}
}).mousedown(function () {
	cache.swipe = true;
	property.scrubberTo = $(this);
	cache.btnArea = {
		left: $(this).offset().left,
		right: $(this).offset().left + $(this).width(),
		top: $(this).offset().top,
		bottom: $(this).offset().top + $(this).height()
	};
}).mouseleave(function (e) {
	if (cache.swipe && !$('.propertyScrubber').hasClass('show')) {
		cache.start = [e.clientX, e.clientY];
		if (e.clientX > cache.btnArea.left && e.clientX < cache.btnArea.right) {
			cache.start = [e.clientX, e.clientY];
			if (e.clientY < cache.btnArea.top + 5) {
				ui.scrubber(true);
			}
			if (e.clientY > cache.btnArea.bottom - 5) {
				ui.scrubber(true, 'down');
			}
		}
		property.setNumValue();
	}
}).contextmenu(function () {
	/*if ($(this).is('[aria-label="stroke"]')) {
	  if (parseInt(cache.ele.attr('stroke-opacity')) > 0) {
		cache.ele.attr('stroke-opacity',0);
		cache.ele
	  } else {
		cache.ele.attr('stroke-opacity',tool.strokeOpacity);
	  }
	}*/
	if ($(this).is('[aria-label="stroke"]')) {
		if (cache.ele.attr('paint-order') == 'stroke') {
			cache.ele.removeAttr('paint-order');
			tool.paintOrder = '';
			cache.ele.attr('stroke-opacity', 0);
			setTimeout(function () {
				cache.ele.attr('stroke-opacity', tool.strokeOpacity);
			}, 0);
			$(this)
		} else {
			cache.ele.attr('paint-order', 'stroke');
			tool.paintOrder = 'stroke';
			cache.ele.attr('stroke-opacity', 0);
			setTimeout(function () {
				cache.ele.attr('stroke-opacity', tool.strokeOpacity);
			}, 0);
		}
	}
})

$('.propertyScrubber').mousedown(function (e) {
	cache.swipe = true;
	cache.start = [e.clientX, e.clientY];
});