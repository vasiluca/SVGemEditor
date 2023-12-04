/** This contains all functions pertaining to the Layers Tab */

import { cache } from '../Cache.js';

import { colors } from './Color.js';

import { deleteButton } from './Property/DeleteButton.js';

var preview; // including the variable outside the layers object seems to help in preventing glitches when dragging layers
var layers = {
	all: [],
	update: function() {
	$('.layers .all').html('');
	colors.picker = [];
	for (var i = $('#editor').children().length-1; i >= 0; i--) { // Thi = {s loops through all of the SVG layers and renders them in the layers tab
		var data = {
			html: $('#editor').children().eq(i)[0].outerHTML,
			type: $('#editor').children().eq(i)[0].outerHTML.replace('<','').split(' ')[0],
			id: $('#editor').children().eq(i).attr('id').length ? $('#editor').children().eq(i).attr('id') : null
		}
		var fillColor, strokeColor, stroke, target;
		if (data.type == 'circle' || data.type == 'ellipse' || data.type == 'rect' ||
			data.type == 'line' || data.type == 'path' || data.type == 'polygon' || data.type == 'g') {
			var ele = $('#' + data.id);
			var stroke = ele.attr('stroke-width');
			var width = ele[0].getBBox().width + stroke/2*2;
			var height = ele[0].getBBox().height + stroke/2*2;
			var transX = -ele[0].getBBox().x + stroke/2;
			var transY = -ele[0].getBBox().y + stroke/2;
			$('.layers .all').append('<div id="'+data.id+'">'+
			'<svg id="'+data.id+'" viewBox="0 0 '+width+' '+height+'" height="50px" width="50px" preserveAspectRatio="xMidYMid meet"><g>' +
			data.html +
			'</g></svg>' +
			'</div>');
			preview = '.layers .all div[id="'+data.id+'"] g';
			var parent = '.layers .all div[id="'+data.id+'"]';
			stroke = parseFloat($(target).attr('stroke-width'));
			if ($(preview).attr('fill')) {
				fillColor = $(preview).attr('fill').toUpperCase();
			} else {
				fillColor = $(preview).css('fill').toUpperCase();
			}
			if ($(preview).attr('stroke')) {
				strokeColor = $(preview).attr('stroke').toUpperCase();
			} else {
				strokeColor = $(preview).css('stroke').toUpperCase();
			}
			if ($(preview).attr('display') == 'none') {
				$(parent).addClass('hidden');
			}
			$(preview).attr('display','block');
			colors.push('picker',strokeColor);
			colors.push('picker',fillColor);
			$(preview).attr({
				'transform': 'translate('+transX+','+transY+')'
			});
			$(preview).css({
				'transform': '',
				'matrix': ''
			});
		}
	}
	},

	deleteSelected: function () {
        // Call deleteButton's handleDelete method
        deleteButton.handleDelete();

        // Update layers after deletion
        this.update();
    },

	moveUp: function(top) {
	if (top) {
		cache.ele.detach().appendTo('#editor');
	} else {
		var index = cache.ele.index();
		var nextEle = cache.ele.next();
		if (nextEle.length) {
			cache.ele.detach().insertAfter(nextEle);
		}
	}
	this.update();
	},
	moveBack: function(bottom) {
	if (bottom) {
		cache.ele.detach().prependTo('#editor');
	} else {
		var index = cache.ele.index();
		var prevEle = cache.ele.prev();
		if (prevEle.length) {
			cache.ele.detach().insertBefore(prevEle);
		}
	}
	this.update();
	},
	drop: function(layer) {
	if (layers.current.hasClass('selected') && $('.layers .selected').length > 1) {
		if (!layer.hasClass('selected')) {
			if (layer.hasClass('drop-above')) {
				$('.layers .selected').insertBefore(layer);
				$('.layers .selected').each(function() {
					$('#editor #' + $(this).attr('id')).detach().insertAfter($('#editor #' + layer.attr('id')));
				});
			} else if (layer.hasClass('drop-below')) {
				$('.layers .selected').insertAfter(layer);
				$('.layers .selected').each(function() {
					$('#editor #' + $(this).attr('id')).detach().insertBefore($('#editor #' + layer.attr('id')));
				});
			} else if (layer.hasClass('drop-group')) {

			}
		}

	} else if (layers.current.attr('id') != layer.attr('id')) {
		if (layer.hasClass('drop-above')) {
			layers.current.detach().insertBefore(layer);
			$('#editor #' + layers.current.attr('id')).detach().insertAfter($('#editor #' + layer.attr('id')));
		} else if (layer.hasClass('drop-below')) {
			layers.current.detach().insertAfter(layer); // insertAfter on this line and below are different because layers are show bottom to top in layers preview
			$('#editor #' + layers.current.attr('id')).detach().insertBefore($('#editor #' + layer.attr('id')));
		} else if (layer.hasClass('drop-group')) {

		}
	}
	console.log(layer);
	console.log(layers.current);
	//if ()

	/*if (layer.hasClass('drop-above')) {
		$('.layers .selected').each(function() {
		$('#editor ' + $(this).attr('id')).detach().index(layer.index());
		});
	} else if (layer.hasClass('drop-below')) {
		$('.layers .selected').each(function() {
		$('#editor ' + $(this).attr('id')).detach().index(layer.index() + 1);
		});
	} else {

	}*/

	}
}

export { layers };