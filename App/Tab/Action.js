/** This contains all functions pertaining to the Actions Tab */
import { cache, pressed } from '../Cache.js';
import { layers } from './Layer.js';

$('.actions div').click(function(e) {
	switch ($(e.target).attr('id')) {
	case 'move-up':
		layers.moveUp();
		if (pressed.cmdKey)
			layers.moveUp(true);
		break;
	case 'move-back':
		layers.moveBack();
		if (pressed.cmdKey)
			layers.moveBack(true);
		break;
	case 'grid':
		$('[aria-label="grid"]').toggleClass('on');
	}
}).mousedown(function() {
	cache.mapKeysTo = 'action';
});