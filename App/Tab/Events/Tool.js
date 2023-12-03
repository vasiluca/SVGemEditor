import { tool } from "../Tool.js";

$('.shapes').on('click', 'div', function (e) {
	$('[aria-label="fill"]').removeAttr('disabled');
	tool.type = $(this).attr('id');
});