/** This contains all functions pertaining to the Properties Tab */

import { cache } from '../Cache.js';
import { ui } from '../UI.js';

import { tool } from './Tool.js';

var property = {
	dynamicUI: function () {

	},
	colorTo: 'stroke', // What the color applies to
	showOptions: function () {

	},
	value: 0,
	setNumValue: function () { // Change the value of a property
		if (!cache.ele) return;
		
		var property = this.scrubberTo;
		var valueChange;
		var scrubAmount = 0;
		if (!$('.propertyScrubber').hasClass('down')) {
			valueChange = ui.location('stroke', 'top') - cache.cursor[1];
		} else {
			valueChange = cache.cursor[1] - ui.location('stroke', 'bottom');
		}
		if (cache.ele.attr('stroke-opacity') == '0') {
			cache.ele.attr('stroke-opacity', 1);
		}
		if (cache.ele) {
			switch (property.attr('aria-label')) {
				case 'stroke':
					valueChange = this.value + valueChange;
					var value;

					value = valueChange;
					scrubAmount = value;
					if (scrubAmount > 190)
						scrubAmount = 190;
						
					if (CSS.supports('stroke-width', value)) {
						cache.ele.attr('stroke-width', value);
						if (value < 10) {
							if (value != 0) {
								value = value.toFixed(1);
							}
						}
						$('.propertyScrubbwer').attr({
							'data-value': value
						}).removeClass('smallText');
						$('.scrub').css({
							'height': scrubAmount
						});
						tool.strokeWidth = value;
						break;
					}
					

			}
		} else {
			$('.propertyScrubber').attr({
				'data-value': 'stroke width'
			}).addClass('smallText');
		}
	}
}

export { property }