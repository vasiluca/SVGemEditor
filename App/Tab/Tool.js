/** This contains all functions pertaining to the Tools Tab */

import { ui } from '../UI.js';

var tool = {
	toolType: 'rect',
	name: false,
	prevName: false,
	prevIndexIMG: -1,
	set type(kind) {
		$('.shapes div').removeClass('selected');
		ui.hideTools(false);
		if (kind == this.toolType) {
			this.toolType = 'selection';
			ui.cursor('default');
		} else if (kind != 'selection') {
			this.toolType = kind;
			ui.cursor('crosshair');
			$('#'+kind).addClass('selected');
		} else {
			this.toolType = 'selection';
			ui.cursor('default');
		}
		if (kind == 'image') {
			$('#inputFile').trigger('click');
			
			this.toolType = 'selection';
			ui.hideTools('selection');
			ui.cursor('copy');
		}
		if (kind == 'drag') {
			this.toolType = 'selection';
			ui.hideTools(true);
			ui.cursor('drag');
		}
		if (kind == 'animate') {
			this.toolType = 'selection';
		}
		this.name = kind;
	},
	get type() {
		return this.toolType;
	},
	stroke: 'black',
	strokeWidth: 4,
	strokeOpacity: 1,
	fillOpacity: 1,
	paintOrder: 'fill',
	fill: 'dimgrey',
	presets: [],
	strokeDashOffset: 0,
	strokeDashArray: 0,
	images: [],
	imageIndex: -1
}

export { tool };