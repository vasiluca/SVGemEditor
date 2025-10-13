import { cache } from "./Cache.js";
import { doc } from "./SetUp.js";
import { layers } from "./Tab/Layer.js";

$('.import').click(function () {
	$('input#file-selector').trigger('click'); // trigger an artifical click on input to run the funciton onChooseFile(event)
})

const editor = document.querySelector('#editor');

function copyAttributes(source, target) {
	const attributes = source.attributes;
	for (const attr of attributes)
		target.setAttribute(attr.name, attr.value);
}
let viewBox;
function getViewBox() {
	viewBox = $('#editor').attr('viewBox');
	let viewScale = [1, 1];
	let dimensions = [0, 0];
	if (viewBox) {
		try { // when viewBox attribute is set, the SVG image will not render without the proper four number values - so we can always expect there to be four numbers for a viewBox
			let viewB = editor.viewBox.baseVal;
			viewBox = [viewB.x, viewB.y, viewB.width, viewB.height];

			// using svg.width.baseVal.value/unitType and svg.height.baseVal.value/unitType does not seem to work well for accessing width and height

			let widthRect = editor.getBoundingClientRect().width;
			let heightRect = editor.getBoundingClientRect().height;
			// taking advantage of jQuery's width() and height() functions to return pixel unit (px) dimensions while ignoring transformations, padding/border etc.
			const width = $(editor).width();
			const height = $(editor).height();

			doc.zoom = widthRect/width; // set doc.zoom to ensure proper drawing for svg imports that are already scaled

			viewScale = [width / viewB.width, height / viewB.height];
		} catch(e) {
			console.warn(e);
			viewBox = [0,0,0,0];
		}
		
	} else {
		viewBox = [0, 0, 0, 0]
	}
	
	cache.viewBox = viewBox;
	cache.viewScale = viewScale;
}

function centerCanvas() {
	// const offsetTop = ($(window).height() - doc.size[1] * doc.zoom) / 2;
	// const offsetLeft = ($(window).width() - doc.size[0] * doc.zoom) / 2;
	const offsetTop = ($(window).height() / 2 - doc.size[1] / 2);
	const offsetLeft = ($(window).width() / 2 - doc.size[0] / 2);
	doc.origPos = [offsetLeft, offsetTop]; // we store the untransformed left and top position of the element
	$('#editor').css({
		'transform': 'scale(' + doc.zoom + ')',
		'top': offsetTop,
		'left': offsetLeft
	});
}

// TODO: Create a new embedded <object> element which includes the SVG to further prevent interference between IDs and element accesses in the container application
function onFileLoad(event) {
	// $('.svg-contain #editor').remove(); // remove the the default #editor SVG canvas
	// const parser = new DOMParser();
	// const doc = parser.parseFromString(event.target, 'application/xml');
	// console.log(doc);

	// avoid removing or directly changing HTML of #editor in order to not invalidate eventListeners (i.e. $('.svg-contain #editor').replaceWith(event.target.result))
	$('.svg-contain').prepend(event.target.result);
	const src = $('.svg-contain > svg')[0];
	const dest = $('.svg-contain > svg')[1];
	copyAttributes(src, dest);

	let srcInnerHTML = src.innerHTML;
	// console.log(event.target.result);

	src.remove();

	$('.svg-contain > svg:first').attr('id', 'editor');
	$('.svg-contain').addClass('show');

	// the jQuery width() and height() methods auto-convert any values that are non-px into pixel values
	var width = $('#editor').width();
	var height = $('#editor').height();

	

	$('.tools').removeClass('hide'); // make the tools visible
	if (width && height) {
		doc.size = [width, height];
	}

	getViewBox();

	centerCanvas();

	$('svg#editor').css('transition', 'all 0.15s ease'); // smooth zooming

	// $('#editor').attr('preserveAspectRatios', 'xMidYMid meet');
	// $('#editor').attr('overflow', 'hidden');

	cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y }; // getBoundingClientRect works on global viewport as opposed getBBox() which works with SVG container only

	dest.innerHTML = srcInnerHTML; // try to prevent rendering issues by copying the elements into the app #editor container after all attributes are set

	// $('#editor')[0].style.display = 'none';
	// $('#editor')[0].offsetHeight; // Force reflow
	// $('#editor')[0].style.display = '';

	layers.update();

	doc.loaded = true;
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
