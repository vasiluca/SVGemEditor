/** This contains all functions pertaining to the Actions Tab */

import { layers } from './Layer.js';

$('.actions div').click(function(e) {
	switch ($(e.target).attr('id')) {
	case 'move-up':
		layers.moveUp();
		break;
	case 'move-back':
		layers.moveBack();
		break;
	case 'grid':
		$('[aria-label="grid"]').toggleClass('on');
	}
}).dblclick(function(e) {
	switch ($(e.target).attr('id')) {
	case 'move-up':
		layers.moveUp(true);
		break;
	case 'move-back':
		layers.moveBack(true);
		break;
	}
});