import { cache } from "../../Cache.js";
import { tool } from "../Tool.js";

$('.shapes').on('click', 'div', function (e) {
	$('[aria-label="fill"]').removeAttr('disabled');
	tool.type = $(this).attr('id');
}).on('mousedown', 'div', function() {
	cache.mapKeysTo = 'tool';
});