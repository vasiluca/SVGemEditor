// This includes all the canvas [document] set up settings

import { tabStates } from './Tabs.js';
import * as test from './Tests/Unit/document.test.js';

// these are the textboxes which automatically are set to contain the current window height and width by default
$('.quickset input:eq(0)').val($(window).innerWidth());
$('.quickset input:eq(1)').val($(window).innerHeight());

var settings = false; // toggles the settings tab
$('.splash .settings').click(function () {
	settings = !settings;
	$('.splash').toggleClass('hide');
	if (settings) {
		$('.start').html('OPTIONS');
	} else {
		$('.start').html('START');
	}
});

var doc = {
	size: [800, 800],
	viewBox: function () {
		$('#editor').attr({
			'viewBox': '0 0 ' + this.size[0] + ' ' + this.size[1],
			'width': this.size[0],
			'height': this.size[1]
		});
		$('.svg-contain').addClass('show');
		$('.tools').removeClass('hide'); // make the tools visible
	},
	zoom: 1
};

$('.start').click(function () {
	if (!settings) { // settings tab is not open
		doc.size = [$('.quickset input:eq(0)').val(), $('.quickset input:eq(1)').val()];
		doc.viewBox();
	}
});

// #autosize is a checkbox that makes the canvas height and width be the same as the window height and width
$('#autosize').change(function () {
	if ($(this).prop('checked')) {
		$('.size input').attr('disabled', 'disabled');
		$('.size input:eq(0)').val($(document).width());
		$('.size input:eq(1)').val($(document).height());
	} else {
		$('.size input').removeAttr('disabled');
	}
	$('.create').addClass('show');
});

$('.create').click(function () { // .create is the button clicked on the settings modal to start the project
	doc.size = [$('.size input:eq(0)').val(), $('.size input:eq(1)').val()];
	doc.viewBox();
	$('.splash').removeClass('hide');

	test.runTest(); //** Checks that the document height and width are valid */
});

$('.size input').change(function () {
	$('.create').addClass('show');
});

$(window).resize(function () { // When 
	$('.quickset input:eq(0)').val($(window).innerWidth());
	$('.quickset input:eq(1)').val($(window).innerHeight());
	tabStates.adjustAllPos();
});

export { doc }