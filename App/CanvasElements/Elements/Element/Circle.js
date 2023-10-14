class Circle extends Element {
	#cx;
	#cy;
	#r;

	Circle() {
		super();
		cx = parseFloat(cache.ele.attr('cx'));
		cy = parseFloat(cache.ele.attr('cy'));
    	r = parseFloat(cache.ele.attr('rx'));
	}
}