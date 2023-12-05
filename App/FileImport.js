import { doc } from "./SetUp.js";

$('.import').click(function () {
	$('input#file-selector').trigger('click'); // trigger an artifical click on input to run the funciton onChooseFile(event)
})

function onFileLoad(event) {
	$('.svg-contain #editor').remove(); // remove the the default #editor SVG canvas
	$('.svg-contain').prepend(event.target.result);
	// $('.svg-contain #editor').replaceWith(event.target.result);
	$('.svg-contain svg:first').attr('id', 'editor');
	$('.svg-contain').addClass('show');
	var width = $('#editor').attr('width');
	var height = $('#editor').attr('height');
	$('.tools').removeClass('hide'); // make the tools visible

	doc.size = [parseInt(width), parseInt(height)];
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
