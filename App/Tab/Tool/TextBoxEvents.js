import { cache } from '../../Cache.js';

import { tool } from '../Tool.js';
import { select } from '../../CanvasElements/Selection.js';

var TextContent = {
	update: function(keyup) {
		if (cache.ele.attr('data-temp') == 'true') {
			$('#GetText').val('');
			cache.ele.attr('data-temp', 'false');
		} else if ($('#GetText').val() == '' && keyup) {
			cache.ele.attr('data-temp','true');
			$('#GetText').val('&nbsp;New Text&nbsp;');
		}
		cache.ele.html($('#GetText').val());
		select.area(cache.ele);
		$('.selection').addClass('selecting');
	}
}

// the focus event on the #GetText Input box has to be on mouseup, otherwise it won't get focused
$(document).on('mouseup',  function() {
	if (cache.ele) {
		var type = cache.ele[0].tagName; // [0] makes sure it can be accessed by jQuery, usually
		console.log(type);
		if (type == 'text') {
			$('#GetText').val(cache.ele.html());
			$('#GetText').focus();
		}
	}

	if (tool.type == 'text') { // addresses input text issue not being reflected on the element when there are no elements (text is the first element created)
		$('#GetText').focus();
	}
}).on('mousemove', function() {
	select.area(cache.ele);
	if (tool.type == 'text') {
		cache.mapKeysTo = 'text';
	}
})

$('#GetText').keyup(function() {
	TextContent.update(true);
})
.keydown(function() {
	TextContent.update();
})

export { TextContent }