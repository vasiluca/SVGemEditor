import { cache, pressed } from "../../Cache.js";
import { newSVG } from "../../CanvasElements/Modify/newSVG.js";
import { ui } from "../../UI.js";

import { layers } from "../Layer.js";
import { tool } from "../Tool.js";
// import * as ImageImport from './ImageImport.js';

function readAndInsert(file) {
	var reader = new FileReader();
	var image = new Image();
	image.src = file.result;
	var width = 100;
	var height = 100;
	reader.readAsDataURL(file);
	reader.onload = function () {
		tool.images.push({
			result: this.result,
			width: width,
			height: height
		});
	}
}

$('#inputFile').on('change', function (e) {
	tool.images = [];
	
	if (e.target) {
		var files = e.target.files;
		tool.imageIndex = files.length - 1;
		tool.prevIndexIMG = files.length - 1;
		for (var i = 0; i < files.length; i++) {
			readAndInsert(files[i]);
		}
	}
	
});

// $('#image').contextmenu(function () {
// 	$('#inputFile').trigger('click');
// });

$(document).on('mouseup', function (e) {
	if (e.which === 1) { // on left click
		if (tool.name == 'image') {
			console.log(tool.images, tool.imageIndex);
			if (tool.imageIndex !== -1 && cache.mapKeysTo === 'canvas') { // when there are images selected and canvas is clicked
				var selection = tool.images[tool.imageIndex];
				if (selection) {
					var posX = e.clientX - selection.width / 2;
					var posY = e.clientY - selection.height / 2;
					// was previously selection.height and selection.width for height and width
					// not specifying width and height so the image auto-sizes to its default dimensions
					newSVG.create('image', undefined, {
						x: posX,
						y: posY
					});
					cache.ele[0].setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', selection.result); // need to use 'namespace' XML link (first parameter) to prevent bugs of non-rendering
					
					layers.update();
				}
				if (!pressed.ctrlKey && tool.imageIndex > -1) {
					tool.imageIndex--;
				}

			}
			if (tool.imageIndex <= -1) {
				tool.type = 'selection';
			}
		}
		if (pressed.spaceBar) {
			ui.cursor('grab');
		}
		// layers.update(); // commented out this line for causing errors
	}
	
});