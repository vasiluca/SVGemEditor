var resize = function(axis) {
	var selection = $('.selection')[0].getBoundingClientRect();
	var rightHandle = pressed.handle.includes('right'); // Check if a handle on the right is being pressed
	var bottomHandle = pressed.handle.includes('bottom'); // Check if a handle on the bottom is being pressed
	var topHandle = pressed.handle.includes('top');
	var leftHandle = pressed.handle.includes('left');
	var selectW, selectH;
	var translateX = (selection.width - cache.origSelectArea.width)/this.initial.scale[0]/doc.zoom;
	var translateY = (selection.height - cache.origSelectArea.height)/this.initial.scale[1]/doc.zoom;

	if (bottomHandle) {
		selectH = cache.stop[1] - cache.origSelectArea.y;
		$('.selection').css({
			'height': selectH
		});
	}
	if (rightHandle) {
		selectW = cache.stop[0] - cache.origSelectArea.x;
		$('.selection').css({
			'width': selectW
		});
	}
	if (topHandle) {
		selectH = cache.origSelectArea.y + cache.origSelectArea.height - cache.stop[1];
		var hDiff = selectH - cache.origSelectArea.height;
		$('.selection').css({
			'height': selectH,
			'top': cache.origSelectArea.y - hDiff
		});
	}
	if (leftHandle) {
		selectW = cache.origSelectArea.x + cache.origSelectArea.width - cache.stop[0];
		var wDiff = selectW - cache.origSelectArea.width;
		$('.selection').css({
			'width': selectW,
			'left': cache.origSelectArea.x - wDiff
		});
	}
	
	if (pressed.altKey) {
		if (bottomHandle) {
			var heightDiff = cache.stop[1] - (cache.origSelectArea.y + cache.origSelectArea.height);
			if (heightDiff == 0) {
				heightDiff = 1;
			}

			this.newScale[1] = selection.height/this.initial.preScaleH/doc.zoom;
		}

		if (rightHandle) {
			var widthDiff = cache.stop[0] - (cache.origSelectArea.x + cache.origSelectArea.width);

			if (widthDiff == 0) {
				widthDiff = 1;
			}

			this.newScale[0] = selection.width/this.initial.preScaleW/doc.zoom;
		}
		cache.ele.attr({
			'transform': 'scale('+this.newScale[0]+','+this.newScale[1]+') ' +
			'translate('+0+','+0+')'
		});
	} else {
		if (pressed.shiftKey) {
			var ratioX = Math.abs(this.initial.height/this.initial.width);
			var ratioY = Math.abs(this.initial.width/this.initial.height);
			if (pressed.handle != 'bottom-handle' && pressed.handle != 'top-handle') {
				translateY = translateX*ratioX;
				$('.selection').css({
				'height': cache.ele[0].getBoundingClientRect().height,
				'top': cache.ele[0].getBoundingClientRect().top
				});
			} else {
				translateX = translateY*ratioY;
				$('.selection').css({
				'width': cache.ele[0].getBoundingClientRect().width,
				'left': cache.ele[0].getBoundingClientRect().left
				});
			}
			/*$('.selection').css({
				'width': cache.ele[0].getBoundingClientRect().width,
				'left': cache.ele[0].getBoundingClientRect().left
			});*/
			//console.log("Shift key is pressed");
		}

		switch (this.type) {
			case 'line':
				var x1 = this.line.x1;
				var x2 = this.line.x2;
				var y1 = this.line.y1;
				var y2 = this.line.y2;
				if (rightHandle) {
					this.line.x2 > this.line.x1 ? x2 = this.line.x2 + translateX : x1 = this.line.x1 + translateX;
				}
				if (bottomHandle) {
					this.line.y2 > this.line.y1 ? y2 = this.line.y2 + translateX : y1 = this.line.y1 + translateX;
				}
				if (topHandle) {
					this.line.y1 < this.line.y2 ? y1 = this.line.y1 - translateX : y2 = this.line.y2 - translateX;
				}
				if (leftHandle) {
					this.line.x1 < this.line.x2 ? x1 = this.line.x1 - translateX : x2 = this.line.x2 - translateX;
				}
				cache.ele.attr({
					'x1': x1,
					'x2': x2,
					'y1': y1,
					'y2': y2
				});
				break;
			case 'rect':
				var width = this.rect.width;
				var height = this.rect.height;
				var x = this.rect.x;
				var y = this.rect.y;
				if (rightHandle) {
					if (pressed.cmdKey) {
						x = x - translateX;
						width = width + translateX*2;
					} else {
						width = width + translateX;
					}
				}
				if (bottomHandle) {
					if (pressed.cmdKey) {
						y = y - translateY;
						height = height + translateY*2;
					} else {
						height = height + translateY;
					}
				}
				if (topHandle) {
					if (pressed.cmdKey) {
						y = y - translateY;
						height = height + translateY*2;
					} else {
						height = height + translateY;
						y = y - translateY;
					}
				}
				if (leftHandle) {
					if (pressed.cmdKey) {
						x = x - translateX;
						width = width + translateX*2;
					} else {
						width = this.rect.width + translateX;
						x = this.rect.x - translateX;
					}
				}
				width < 1 ? width = 1 : null;
				height < 1 ? height = 1 : null;
				cache.ele.attr({
					'x': x,
					'y': y,
					'width': width,
					'height': height
				});
				break;
			case 'ellipse':
				var cx = this.ellipse.cx;
				var cy = this.ellipse.cy;
				var rx = this.ellipse.rx;
				var ry = this.ellipse.ry;
				if (rightHandle) {
					if (pressed.cmdKey) {
					rx = rx + translateX;
					} else {
					rx = rx + translateX/2;
					cx = cx + translateX/2;
					}

				}
				if (bottomHandle) {
					if (pressed.cmdKey) {
						ry = ry + translateY;
					} else {
						ry = ry + translateY/2;
						cy = cy + translateY/2;
					}
				}
				if (topHandle) {
					if (pressed.cmdKey) {
						ry = ry + translateY;
					} else {
						ry = ry + translateY/2;
						cy = cy - translateY/2;
					}
				}
				if (leftHandle) {
					if (pressed.cmdKey) {
						rx = rx + translateX;
					} else {
						rx = rx + translateX/2;
						cx = cx - translateX/2;
					}
				}
				//rx < 1 ? rx = 1 : null;
				//ry < 1 ? ry = 1 : null;
				cache.ele.attr({
					'rx': rx,
					'ry': ry,
					'cx': cx,
					'cy': cy
				});
				break;
			case 'circle':
				if (!pressed.shiftKey) {
					var elementID = cache.ele.attr('id');
					var radius = parseFloat(cache.ele.attr('r'));
					element.attr({
						'rx': radius,
						'ry': radius
					});
					var index = cache.ele.index();
					cache.ele.remove();
					svg.new('ellipse',element.attr(),elementID).eq(index);
				}

		}
	}
}

export { resize }