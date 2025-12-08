// This includes all the canvas [document] set up settings
import { cache, pressed } from './Cache.js';

import { select } from './CanvasElements/Selection.js';

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
	loaded: false,
	size: [800, 800],
	origPos: [0, 0],
	showCanvas: function() {
		$('.svg-contain').addClass('show');
		$('.tools').removeClass('hide'); // make the tools visible

		doc.loaded = true;
	},
	viewBox: function () {
		$('#editor').attr({
			'viewBox': '0 0 ' + this.size[0] + ' ' + this.size[1],
			'width': this.size[0],
			'height': this.size[1]
		});
		this.showCanvas();
	},
	zoom: 1,
	newScale: 1,
	viewScale: [1, 1],
	scaleFit: [1, 1],
	scale: () => [this.viewScale[0] / this.scaleFit[0], this.viewScale[1] / this.scaleFit[1]]
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

let timeout = false;
let interval;
let prevZoom = 1;
let dim = [0, 0];
let prevPos = [0, 0];
const editor = document.querySelector('#editor');
let origin;
const zoomSpeed = 0.05;
const maxZoom = 20;

let client = [$(window).width()/2, $(window).height()/2]; // this stores a fixed mouse position point (unless zooming out, in which case it is updated)
let clientX, clientY; // this stores relative mouse position limited/affescted by the 'client' mouse point var and zoom level

let lastCheckedZoom = doc.zoom;
let timeoutFn;
let prevZoomDir = '';
$(document).on('wheel', function (e) {
	if (!cache.mousedown && doc.loaded) {
		cache.canvas = { x: editor.getBoundingClientRect().x, y: editor.getBoundingClientRect().y };
		dim = [editor.getBoundingClientRect().width, editor.getBoundingClientRect().height];

		// let origin = [doc.size[0] / 2, doc.size[1] / 2]; // by default the origin is at the center, until we scale up the canvas
		if (!$(e.target).is('.tools *') && !$(e.target).is('.animatable')) {
			if (e.originalEvent.deltaY > 0) { // scrolling up - zooming out
				if (doc.zoom >= 0) {
					if (doc.zoom <= 1) {
						doc.zoom -= zoomSpeed;
					} else
						doc.zoom -= 0.25;

					if (pressed.cmdKey) {
						doc.zoom -= zoomSpeed * 5;
					}

					if (doc.zoom > 10) {
						doc.zoom -= 0.5;
					}

					// snap to scale(1) if the previous zoom was greater than zero, but current is less than 1
					if (prevZoom > 1 && doc.zoom < 1) {
						doc.zoom = 1;
						prevZoom = 1;
					}

				}
				
				if (prevZoomDir === 'in')
					client = [clientX, clientY];

				prevZoom = doc.zoom;
				prevZoomDir = 'out';
			}
			if (e.originalEvent.deltaY < 0) { // scrolling down - zooming in
				// we will only change the origin when zooming in, because otherwise it becomes disorienting

				if (doc.zoom < maxZoom) {
					// doc.zoom += zoomSpeed * (maxZoom / (maxZoom-doc.zoom));
					doc.zoom += zoomSpeed;
					if (pressed.cmdKey) {
						doc.zoom += zoomSpeed * 5;
					}
					// if (doc.zoom < 10) {
					// 	doc.zoom += 0.5;
					// }
				}

				// snap to scale(1) if the previous zoom was less than zero, but current is greater than 1
				if (prevZoom < 1 && doc.zoom > 1) {
					doc.zoom = 1;
					prevZoom = 1;
				}

				if (prevZoom < doc.zoom) { // we will only update the origin once we've zoomed out before zooming in again
					origin = [(e.clientX - cache.canvas.x) / doc.zoom, (e.clientY - cache.canvas.y) / doc.zoom];
					// origin = [e.clientX - doc.origPos[0], e.clientY - doc.origPos[1]];
				}

				prevZoom = doc.zoom;
				prevZoomDir = 'in';
			}
			if (prevZoom <= 1) {
				client = [e.clientX, e.clientY];
			}
			// the left and top CSS properties are always applied after transformations

			var offsetTop = ($(window).height() / 2 - (e.clientY - doc.origPos[1]));
			var offsetLeft = ($(window).width() / 2 - (e.clientX - doc.origPos[0]));
			// var offsetTop = ($(window).height() / 2 - (e.clientY - cache.canvas.y)/doc.zoom);
			// var offsetLeft = ($(window).width() / 2 - (e.clientX - cache.canvas.x)/doc.zoom);

			if (doc.zoom <= 1) {
				offsetTop = ($(window).height() / 2 - doc.size[1] / 2);
				offsetLeft = ($(window).width() / 2 - doc.size[0] / 2);
				origin = [doc.size[0] / 2, doc.size[1] / 2];
			}

			if (origin[0] < 0)
				origin[0] = 0;
			if (origin[1] < 0)
				origin[1] = 0;

			if (origin[0] > doc.size[0])
				origin[0] = doc.size[0]
			if (origin[1] > doc.size[1])
				origin[1] = doc.size[1]

			if (doc.zoom < 0)
				doc.zoom = 0;

			let newWidth = doc.size[0] * doc.zoom;
			let newHeight = doc.size[1] * doc.zoom;

			let crispZoom = true;
			if (crispZoom) {
				offsetTop = ($(window).height() / 2 - newHeight / 2);
				offsetLeft = ($(window).width() / 2 - newWidth / 2);
				if (doc.zoom > 1) {
					const zoomX = newWidth / doc.size[0];
					const zoomY = newHeight / doc.size[1];
					clientX = client[0] + (e.clientX - client[0])/zoomX;
					clientY = client[1] + (e.clientY - client[1])/zoomY;
					offsetTop = $(window).height() / 2 - (clientY - doc.origPos[1])*zoomY;
					offsetLeft = $(window).width() / 2 - (clientX - doc.origPos[0])*zoomX;
				}
			}
			// we need to include transform-origin, because while 50% 50% (center) is default, a (scaled) viewBox attribute will impact the origin
			// transform-origin is established relative to the viewBox coordinate system once it is established
			$('#editor').css({
				// 'transform': 'scale(' + doc.zoom + ')',
				'width': doc.size[0] * doc.zoom || 1,
				'height': doc.size[1] * doc.zoom || 1,
				'top': offsetTop,
				'left': offsetLeft,
				// 'transform-box': 'border-box', // transform-box makes transform-origin relative to the element's own parent bounding box (rather than internal coordinate viewBox for children elements)
				'transform-origin': origin[0] + 'px ' + origin[1] + 'px',
				// 'transition': 'all 0s ease'
			});
			select.transition = true;
			select.area(cache.ele);

			function selectFn() {
				timeout = false;
				if (lastCheckedZoom === doc.zoom) {
					select.transition = false;
					select.area(cache.ele);
				} else {
					clearTimeout(timeoutFn);
					timeoutFn = setTimeout(selectFn, 500);
				}
			}
			
			selectFn();
			lastCheckedZoom = doc.zoom;
		}
	}
	
});

export { doc }