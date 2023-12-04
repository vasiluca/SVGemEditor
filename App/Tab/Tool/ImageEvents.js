import { tool } from "../Tool.js";
// import * as ImageImport from './ImageImport.js';

$(document).mouseup(function (e) {
	if (tool.name == 'image') {
		if (tool.imageIndex != -1) {
			var selection = tool.images[tool.imageIndex];
			var posX = e.clientX - selection.width / 2;
			var posY = e.clientY - selection.height / 2;
			// was previously selection.height and selection.width for height and width
			var element = '<image xlink:href="' + selection.result + '" height="' + 500 + '" width="auto" x="' + posX + '" y="' + posY + '"/>';
			$('#editor').html($('#editor').html() + element);
			if (!pressed.ctrlKey && tool.imageIndex > -1) {
				tool.imageIndex--;
			}
		}
		if (tool.imageIndex == -1) {
			tool.type = 'selection';
		}
	}
	if (pressed.spaceBar) {
		ui.cursor('grab');
	}
	layers.update();
});