import { cache } from '../../../Cache.js';
import { svg } from '../../SVG.js';

class Circle extends Element {
	#cx;
	#cy;
	#r;

	constructor() {
		super();
     	var radius = Math.sqrt(Math.pow(cache.stop[0] - cache.start[0], 2) + Math.pow(cache.stop[1] - cache.start[1], 2));
		svg.new('circle', {
			'cx': cache.start[0],
			'cy': cache.start[1],
			'r': radius,
			'fill': tool.fill
		});
		
	}

	parseAttr(ele) {
		cx = parseFloat(ele.attr('cx'));
		cy = parseFloat(ele.attr('cy'));
    	r = parseFloat(ele.attr('rx'));
	}
}