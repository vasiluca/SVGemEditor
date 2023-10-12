/** This contains all functions pertaining to the Properties Tab */

import { cache } from '../Cache.js';

import { tool } from './Tool.js';

var property = {
	dynamicUI: function() {

	},
	colorTo: 'stroke', // What the color applies to
	showOptions: function() {

	},
	setNumValue: function() { // Change the value of a property
		var property = this.scrubberTo;
		var valueChange = cache.stop[1] - cache.start[1];
		var scrubAmount = 0;
		if (!$('.propertyScrubber').hasClass('down')) {
			valueChange = cache.start[1] - cache.stop[1];
		}
		if (cache.ele.attr('stroke-opacity') == '0') {
			cache.ele.attr('stroke-opacity',1);
		}
		if (cache.ele) {
			switch(property.attr('aria-label')) {
			case 'stroke':
				if (!$('.propertyScrubber').hasClass('show')) {
				if (cache.ele.attr('stroke-width')) {
					this.value = Math.round(parseFloat(cache.ele.attr('stroke-width')));
				} else {
					this.value = 0;
				}
				}
				valueChange = this.value + valueChange;
				var value;
				if (valueChange < 100) {
				value = valueChange/10;
				scrubAmount = value * 10;
				} else {
				value = Math.round((valueChange)-90);
				scrubAmount = value + 90;
				}
				if (value > 100) {
				value = 100;
				scrubAmount = 190;
				cache.start = [cache.stop[0],cache.stop[1]];
				this.value = 100;
				}
				if (value < 0) {
				value = 0;
				scrubAmount = 0;
				cache.start = [cache.stop[0],cache.stop[1]];
				this.value = 0;
				}
				cache.ele.attr('stroke-width',value);
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
		} else {
			$('.propertyScrubber').attr({
			'data-value': 'stroke width'
			}).addClass('smallText');
		}
	}
}

export { property }