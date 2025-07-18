import { cache } from "./Cache.js";
import { doc } from "./SetUp.js";
import { layers } from "./Tab/Layer.js";

$('.import').click(function () {
	$('input#file-selector').trigger('click'); // trigger an artifical click on input to run the funciton onChooseFile(event)
})

function copyAttributes(source, target) {
	const attributes = source.attributes;
	for (const attr of attributes)
		target.setAttribute(attr.name, attr.value);
}
const editor = document.querySelector('#editor');
function onFileLoad(event) {
	// $('.svg-contain #editor').remove(); // remove the the default #editor SVG canvas
	// const parser = new DOMParser();
	// const doc = parser.parseFromString(event.target, 'application/xml');
	// console.log(doc);

	// avoid removing or directly changing HTML of #editor in order to not invalidate eventListeners
	$('.svg-contain').prepend(event.target.result);
	const src = $('.svg-contain > svg')[0];
	const dest = $('.svg-contain > svg')[1];
	copyAttributes(src, dest);
	dest.innerHTML = src.innerHTML;
	// console.log(event.target.result);

	src.remove();
	// copyAttributes(event.target.result, document.querySelector('#editor'));
	// $('.svg-contain #editor').replaceWith(event.target.result);
	$('.svg-contain > svg:first').attr('id', 'editor');
	$('.svg-contain').addClass('show');

	var width = $('#editor').attr('width');
	var height = $('#editor').attr('height');
	$('.tools').removeClass('hide'); // make the tools visible
	if (width && height) {
		doc.size = [parseInt(width), parseInt(height)];
	}

	cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y }; // getBoundingClientRect works on global viewport as opposed getBBox() which works with SVG container only

	layers.update();
}

function onChooseFile(event) {
	var fileList = event.target.files; // an array starting at 0 in the order that the user selected the files
	var file = fileList[0];

	var reader = new FileReader();
	reader.addEventListener('load', function (e) {
		onFileLoad(e);
	});
	
	reader.readAsText(file);
	// reader.readAsBinaryString(file); // readAsBinary is an alternative to readAsText
}
window.onChooseFile = onChooseFile; // make sure that the onChooseFile is accessible as an event in HTML
