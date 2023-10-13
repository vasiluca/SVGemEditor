/** This contains all functions pertaining to the Tools Tab */

import { ui } from '../UI.js';

var tool = {
	toolType: 'line',
	name: false,
	prevName: false,
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
			if (tool.imageIndex == -1) {
				$('#inputFile').trigger('click');
				tool.imageIndex = tool.prevIndexIMG;
			}
			this.toolType = 'selection';
			ui.hideTools('selection');
			ui.cursor('copy');
		}
		if (kind == 'drag' && !pressed.spaceBar) {
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
	strokeWidth: 10,
	strokeOpacity: 1,
	fillOpacity: 1,
	paintOrder: 'fill',
	fill: 'black',
	presets: [],
	strokeDashOffset: 0,
	strokeDashArray: 0,
	images: [],
	imageIndex: -1
}

export { tool };