import { cache, pressed } from './Cache.js';
import { doc } from './SetUp.js';
import { tabStates, util } from './Tabs.js';
import { ui } from './UI.js';

import { tool } from './Tab/Tool.js'
import { colors } from './Tab/Color.js';
import { property } from './Tab/Property.js';
import { layers } from './Tab/Layer.js';

$(document).ready(function() {


  $(document).contextmenu(function(e) {
    e.preventDefault();
  }).keydown(function(e) {
    
    if (!$('.color input.user').is(':focus')) { // check that the user isn't actively typing in a color in the color tab
      if ($('.svg-contain').hasClass('show')) { 
            e.preventDefault();
      }
      switch (e.which) {
        case 9: // Tab key is pressed
          //$('.warn').toggleClass('show');
          break;
        case 16: // shift key pressed
          pressed.shiftKey = true;
          break;
        case 17:
          pressed.ctrlKey = true;
          break;
        case 18: // alt key (or option key on mac) is pressed
          pressed.altKey = true;
          break;
        /*case 32: // Spacebar is pressed
          tool.type = 'drag';
          pressed.spaceBar = true;
          break;*/
        case 91: // Command key is presssed on mac
        case 93:
          pressed.cmdKey = true;
          break;
        case 27: // Escape key is pressed
          if (tool.type == 'selection') {
            $('.selection').css('display','none');
            //cache.ele = false;
          } else {
            tool.type = 'selection';
          }
          break;
        case 8: // Backspace key (Windows) or Delete key (MacOS) pressed
          cache.ele.remove();
          layers.update();
          $('.selection').css('display','none');
          break;
        case 9:
          pressed.tabKey = true;
          break;
        case 20: // Caps lock key is pressed
          if (cache.mapKeysTo == 'color') {
            if ($('.color .user').is(':focus')) {
              $('.color .user').blur();
            } else {
              $('.color .user').focus();
            }
          }
          break;
      }
    }
    if ($(e.target).is('.color *')) {
      $('.color input.user').focus();
    }
  }).keyup(function(e) {
    switch (e.which) {
      case 16: // Shift key is lifted
        pressed.shiftKey = false;
        break;
      case 17:
        pressed.ctrlKey = false;
        break;
      case 18:
        pressed.altKey = false;
        break;
      case 32: // Spacebar is lifted
        pressed.spaceBar = false;
        tool.type = 'selection';
        break;
      case 91: // Command key is lifted on mac
      case 93:
        pressed.cmdKey = false;
        break;
      case 9:
        pressed.tabKey = false;

    }
  }).mousedown(function(e) {
    if ($('.propertyScrubber').hasClass('show') && !$(e.target).is('.propertyScrubber, .propertyScrubber *')) {
      $('.propertyScrubber').removeClass('show');
    }
  });
  




  var translateX = 0;
  var translateY = 0;
  var svg = {
    numID: 0,
    created: false,
    new: function(ele, attr, id) {
      if (svg.created == false) {
        if (!id) {
          id = this.numID;
        }
        $('#editor').html($('#editor').html() + '<' + ele + ' id=' + id + '/>');
        this.id = '#' + id;
        cache.ele = id;
        this.numID++;
        this.created = true;
        this.finished = false;
      }
      attr['stroke-width'] = tool.strokeWidth;
      attr.stroke = tool.stroke;
      if (ele != 'line' && ele != 'polyline') {
        attr['paint-order'] = tool.paintOrder;
      }
      $(this.id).attr(attr);
    },
    storeAttr: function() {
      cache.origSelectArea = {
        x: $('.selection')[0].getBoundingClientRect().left,
        y: $('.selection')[0].getBoundingClientRect().top,
        width: $('.selection')[0].getBoundingClientRect().width,
        height: $('.selection')[0].getBoundingClientRect().height
      }
      this.type = cache.ele[0].outerHTML.split(' ')[0].replace('<','');
      switch (this.type) { // Stores element-specific data for later manipulation
        case 'line':
          this.line = {
            x1: parseFloat(cache.ele.attr('x1')),
            x2: parseFloat(cache.ele.attr('x2')),
            y1: parseFloat(cache.ele.attr('y1')),
            y2: parseFloat(cache.ele.attr('y2'))
          }
          break;
        case 'rect':
          this.rect = {
            x: parseFloat(cache.ele.attr('x')),
            y: parseFloat(cache.ele.attr('y')),
            width: parseFloat(cache.ele.attr('width')),
            height: parseFloat(cache.ele.attr('height'))
          }
          break;
        case 'ellipse':
          this.ellipse = {
            cx: parseFloat(cache.ele.attr('cx')),
            cy: parseFloat(cache.ele.attr('cy')),
            rx: parseFloat(cache.ele.attr('rx')),
            ry: parseFloat(cache.ele.attr('ry'))
          }
          break;
        case 'circle':
          this.circle = {
            cx: parseFloat(cache.ele.attr('cx')),
            cy: parseFloat(cache.ele.attr('cy')),
            r: parseFloat(cache.ele.attr('rx'))
          }
          break;
      }

      var scale = [1,1];
      var rotate = 0;
      if (cache.ele.attr('transform')) {
        var propVal = cache.ele.attr('transform').replace(')','').split(' ');
        for (var i = 0; i < propVal.length; i++) {
          if (propVal[i].startsWith('scale')) {
            var scaleX = parseFloat(propVal[i].split('(')[1].split(',')[0]);
            var scaleY = parseFloat(propVal[i].split('(')[1].split(',')[1]);
            scale = [scaleX,scaleY];
          }
          if (propVal[i].startsWith('rotate')) {
            rotate = parseFloat(propVal[i].split('(')[1].split('deg')[0]);
          }
        }
      }
      this.initial = { // Stores x, y, etc. values so that it can be accessed later to calculate transformations
        x: cache.ele[0].getBoundingClientRect().left,
        y: cache.ele[0].getBoundingClientRect().top,
        width: cache.ele[0].getBoundingClientRect().width,
        height: cache.ele[0].getBoundingClientRect().height,
        scale: scale,
        rotate: rotate,
        preScaleH: Math.abs(cache.origSelectArea.height - cache.origSelectArea.height/scale[1]),
        preScaleW: Math.abs(cache.origSelectArea.width - cache.origSelectArea.width/scale[0])
      }
      this.newScale = scale;
    },
    setColor: function() {

    },
    transform: function(axis) {
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
    },
    move: function(direction) {
      translateX = cache.stop[0] - cache.start[0];
      translateY = cache.stop[1] - cache.start[1];
      if (direction != undefined) {
        switch (direction) {
          case 'right':
            translateX = cache.moveAmount;
            break;
          case 'left':
            translateX = -cache.moveAmount;
            break;
          case 'up':
            translateY = -cache.moveAmount;
            break;
          case 'down':
            translateY = cache.moveAmount;
            break;
        }
      }
      translateX = translateX/this.initial.scale[0]/doc.zoom;
      translateY = translateY/this.initial.scale[1]/doc.zoom;
      var transXabs = Math.abs(translateX);
      var transYabs = Math.abs(translateY);
      if ((pressed.shiftKey || pressed.cmdKey) && cache.dragDir == false) {
        translateX *= this.initial.scale[0];
        translateY *= this.initial.scale[1];
        if (translateY/3 < translateX && translateY > translateX/3 ||
            translateY/3 > translateX && translateY < translateX/3) { // Dragging element diagnolly left-up or right-down
          translateY = translateX;
          if (pressed.cmdKey) {
            cache.dragDir = 'right-down';
          }
        } else if (-translateY/3 < translateX && -translateY > translateX/3 ||
                   -translateY/3 > translateX && -translateY < translateX/3) { // Dragging the element diagnolly down-left or up-right
          translateY = -translateX;
          if (pressed.cmdKey) {
            cache.dragDir = 'up-right';
          }
        } else {
          if (transXabs > transYabs) { // Dragging the element up or down
            translateY = 0;
            if (pressed.cmdKey) {
              cache.dragDir = 'verti';
            }
          }
          if (transYabs > transXabs) { // Dragging the element left or right
            translateX = 0;
            if (pressed.cmdKey) {
              cache.dragDir = 'horiz';
            }
          }
        }
      }
      if (pressed.cmdKey || pressed.altKey) {
        switch (cache.dragDir) {
          case 'right-down':
            translateY = translateX;
            break;
          case 'up-right':
            translateY = -translateX;
            break;
          case 'verti':
            translateY = 0;
            break;
          case 'horiz':
            translateX = 0;
            break;
        }
      } else {
        cache.dragDir = false;
      }
      switch (this.type) {
        case 'line':
          cache.ele.attr({
            'x1': (this.line.x1 + translateX),
            'x2': (this.line.x2 + translateX),
            'y1': (this.line.y1 + translateY),
            'y2': (this.line.y2 + translateY)
          });
          break;
        case 'rect':
          cache.ele.attr({
            'x': this.rect.x + translateX,
            'y': this.rect.y + translateY
          });
          break;
        case 'ellipse':
          cache.ele.attr({
            'cx': this.ellipse.cx + translateX,
            'cy': this.ellipse.cy + translateY
          });
          break;
        case 'circle':
          cache.ele.attr({
            'cx': this.circle.cx + translateX,
            'cy': this.circle.cy + translateY
          });
      }
      draw.selection(cache.ele);
      this.previewMove();
    },
    previewMove: function() {
      var x1 = (this.initial.x - $('#editor').offset().left + this.initial.width/2)/doc.zoom;
      var y1 = (this.initial.y - $('#editor').offset().top + this.initial.height/2)/doc.zoom;
      var x2 = (cache.ele[0].getBoundingClientRect().left - $('#editor').offset().left + cache.ele[0].getBoundingClientRect().width/2)/doc.zoom;
      var y2 = (cache.ele[0].getBoundingClientRect().top - $('#editor').offset().top + cache.ele[0].getBoundingClientRect().height/2)/doc.zoom;
      if (pressed.cmdKey || pressed.shiftKey) {
        if (!$('.draggingPreview').length) {
          $('#editor').html($('#editor').html() + '<line class="draggingPreview" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="rgba(255,255,255,0.75)" stroke-width="'+(3/doc.zoom)+'"></line>');
          $('#editor').html($('#editor').html() + '<line class="draggingPreview2" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'" stroke="orange" stroke-width="'+(1/doc.zoom)+'"></line>');

        } else {
          $('.draggingPreview, .draggingPreview2').attr({
            'x1': x1,
            'y1': y1,
            'x2': x2,
            'y2': y2
          });
          var distance = Math.sqrt(Math.pow(x2 - x1,2) + Math.pow(y2 - y1,2));
          distance = (Math.round(10*distance)/10);

          var left = $('.draggingPreview2')[0].getBoundingClientRect().left + $('.draggingPreview2')[0].getBoundingClientRect().width/2;
          var top = $('.draggingPreview2')[0].getBoundingClientRect().top + $('.draggingPreview2')[0].getBoundingClientRect().height/2;
          $('.numberPreview').text(distance);
          if (distance < 50/(doc.zoom)) {
            if (y1 < y2) {
              top = y1-10/doc.zoom;
            }
            if (y1 > y2) {
              top = y1+10/doc.zoom;
            }
            if (x1 < x2) {
              left = x1-15/doc.zoom;
            }
            if (x1 > x2) {
              left = x1+15/doc.zoom;
            }
          }
          $('.numberPreview').css({
            'display': 'block',
            'left': left,
            'top': top
          });
        }
      } else {
        $('.draggingPreview, .draggingPreview2').remove();
        $('.numberPreview').css('display','none');
      }
    },
    pathData: []
  }


  var draw = {
    animate: function() {

    },
    path: function() { // The function for creating a path element
      if (!svg.created) {
        svg.pathData = cache.ele.attr('d').split(' ');
      }
      svg.new('path', {
        d: "M " + cache.start[0] + "," + cache.start[1]
      });
    },
    brush: function() {

    },
    text: function() {

    },
    polyline: function() { // The function for creating a polyline element

    },
    polygon: function() { // The function for creating a polygon element

    },
    line: function() { // The function for creating a line
      svg.new('line', {
        'x1': cache.start[0],
        'y1': cache.start[1],
        'x2': cache.stop[0],
        'y2': cache.stop[1]
      });
      svg.finished = true; // When the user is done drawing the element, selection handles will be displayed on mouse up
    },
    circle: function() { // The function for creating a circle element
      var radius = Math.sqrt(Math.pow(cache.stop[0] - cache.start[0], 2) + Math.pow(cache.stop[1] - cache.start[1], 2));
      svg.new('circle', {
        'cx': cache.start[0],
        'cy': cache.start[1],
        'r': radius,
        'fill': tool.fill
      });
      svg.finished = true;
    },
    ellipse: function() { // The function for creating an ellipse element
      var cx = cache.start[0];
      var cy = cache.start[1];
      var rx = Math.abs(cache.stop[0] - cache.start[0]);
      var xDiff = cache.stop[0] - cache.start[0];
      var ry = Math.abs(cache.stop[1] - cache.start[1]);
      var yDiff = cache.stop[1] - cache.start[1];
      if (pressed.shiftKey) {
        ry = rx;
      }
      if (rx <= 1) {
        rx = 1;
      }
      if (ry <= 1) {
        ry = 1;
      }
      if (pressed.cmdKey) {
        cx = cache.start[0];
        cy = cache.start[1];
      } else {
        if (xDiff > 0) {
          rx /= 2;
          cx += rx;
        }
        if (yDiff > 0) {
          ry /= 2;
          cy += ry;
        }
        if (xDiff < 0) {
          rx /= 2;
          cx -= rx;
        }
        if (yDiff < 0) {
          ry /= 2;
          cy -= ry;
        }
      }


      svg.new('ellipse', {
        'cx': cx,
        'cy': cy,
        'rx': rx,
        'ry': ry,
        'fill': tool.fill
      });
      svg.finished = true;
    },
    rect: function() { // The function for creating a rect(angle) element
      var width = Math.abs(cache.stop[0] - cache.start[0]);
      var height = Math.abs(cache.stop[1] - cache.start[1]);
      var x = cache.start[0];
      var y = cache.start[1];
      if (pressed.shiftKey) {
        height = width;
      }

      if (height <= 0) {
        height = 0.1;
      }
      if (width <= 0) {
        width = 0.1;
      }
      svg.new('rect', {
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'fill': tool.fill
      });
      var widthDiff = cache.stop[0] - cache.start[0];
      var heightDiff = cache.stop[1] - cache.start[1];
      widthDiff < 0 ? x = x - cache.ele.attr('width') : x = x;
      heightDiff < 0 ? y = y - cache.ele.attr('height') : y = y;
      if (pressed.cmdKey) {
        if (widthDiff > 0) {
          x -= width;
          width *= 2;
        }
        if (heightDiff > 0) {
          y -= height;
          height *= 2;
        }
        if (widthDiff < 0) {
          width *= 2;
        }
        if (heightDiff < 0) {
          height *= 2;
        }
      }
      cache.ele.attr({
        'x': x,
        'y': y,
        'width': width,
        'height': height,
        'fill': tool.fill
      });
      svg.finished = true;
    },
    selection: function(ele) {
      var area = {
        x: cache.stop[0] > cache.start[0] ? cache.start[0] : cache.stop[0],
        y: cache.stop[1] > cache.start[1] ? cache.start[1] : cache.stop[1],
        width: cache.stop[0] > cache.start[0] ? cache.stop[0] - cache.start[0] : cache.start[0] - cache.stop[0],
        height: cache.stop[1] > cache.start[1] ? cache.stop[1] - cache.start[1] : cache.start[1] - cache.stop[1]
      }
      if (ele != undefined) {
        if (ele == true) {
          if (!pressed.shiftKey) {
            $('.outline').remove();
            $('.outline2').remove();
          }
          cache.hoverEle.clone().removeAttr('id').addClass('outline').insertBefore(cache.hoverEle);
          cache.hoverEle.clone().removeAttr('id').addClass('outline2').insertBefore($('.outline'));
          $('.outline').attr({
            'stroke': 'rgba(255,255,255,0.75)',
            'stroke-width': parseInt(cache.ele.attr('stroke-width')) + 3.5,
            'fill': 'transparent'
          });
          $('.outline2').attr({
            'stroke': 'cornflowerblue',
            'stroke-width': parseInt(cache.ele.attr('stroke-width')) + 7,
            'fill': 'transparent'
          });
        } else if (ele == false) {
          $('.outline').remove();
          $('.outline2').remove();
        } else {
          area = {
            x: $(ele)[0].getBoundingClientRect().x,
            y: $(ele)[0].getBoundingClientRect().y,
            width: $(ele)[0].getBoundingClientRect().width,
            height: $(ele)[0].getBoundingClientRect().height
          }
        }
      }
      if (ele != true) {
        $('.selection').css({
          'left': area.x,
          'top': area.y,
          'width': area.width + 2,
          'height': area.height + 2
        });
      }
      //$('#movePreview').html('');
      svg.finished = true;
    }
      // if (tool.type != 'selection') {
      //   svg.selectionAreas[svg.numID - 1] = obj;
      // }
  }


  $('#editor, .selection').mousedown(function(e) {
    if (e.which == 1) {
      cache.start = [e.clientX,e.clientY];
      if (!$(e.target).is('.selection *') && tool.type != 'selection') {
        $('.selection').css('display','none');
        cache.press = true;
      } else if ($(e.target).is('.selection *')) {
        svg.storeAttr();
        pressed.handle = $(e.target).attr('class');
      } else if ($(e.target).is('.selection')) {
        svg.storeAttr();
        pressed.element = true;
      } else {
        cache.press = true;
        ui.resizeHandles(true);
        draw.selection();
      }
      if (tool.name == 'drag') {
        ui.cursor('grabbing');
      }
    }
    if (tool.type == 'selection' && !$(e.target).is('.selection, .selection *')) {
      ui.resizeHandles(false);
    }

  }).click(function(e) {
    if (tool.type == 'selection') {
      if ($(e.target).is('#editor *')) {
        cache.ele = $(e.target).attr('id');
        draw.selection(cache.ele);
        ui.resizeHandles(true);
        svg.storeAttr();
        $('.selection').css('display','block');
        tool.stroke = cache.ele.attr('stroke');
        $('.layers #' + cache.ele).addClass('selected');
      }
    }
  });
  $('#editor').mousemove(function(e) {
    if ($(e.target).is('#editor *') && cache.press == false && tool.type == 'selection' && !pressed.handle) {
      cache.hoverEle = $(e.target).attr('id');
      //draw.selection(true);
    } else {
      $('.outline').remove();
      $('.outline2').remove();
    }
  }).dblclick(function() {
    if (tool.name != 'selection') {
      tool.type = 'selection';
    }
  }).mouseup(function(e) {
    if (tool.name == 'image') {
      if (tool.imageIndex != -1) {
        var selection = tool.images[tool.imageIndex];
        var posX = e.clientX - selection.width/2;
        var posY = e.clientY - selection.height/2;
        // was previously selection.height and selection.width for height and width
        var element = '<image xlink:href="'+selection.result+'" height="'+500+'" width="auto" x="'+posX+'" y="'+posY+'"/>';
        $('#editor').html($('#editor').html() + element);
        if (!pressed.ctrlKey && tool.imageIndex > -1) {
          tool.imageIndex--;
        }
      }
      if (tool.imageIndex == -1) {
        tool.type = 'selection';
      }
    }
    if (pressed.spaceBar) {
      ui.cursor('grab');
    }
    layers.update();
  });

  $(document).mousemove(function(e) {
    cache.stop = [e.clientX,e.clientY];
    if (cache.press && tool.type != 'selection') {
      draw[tool.type]();
    }
    if (pressed.handle) {
      svg.transform();
    }
    if (pressed.element) {
      svg.move();
    }
    if (cache.dragTab == true) {
      tabStates.focused.css({
        'left': e.clientX - cache.start[0],
        'top': e.clientY - cache.start[1],
        'bottom': 'auto',
        'right': 'auto'
      });
    }
    if (cache.dragColor) {
      if (pressed.shiftKey) {

      }
      $('.colorDragging').css({
        'top': e.clientY-$('.colorDragging').height()/2,
        'left': e.clientX-$('.colorDragging').width()/2
      });
      if ($('.colorDragging').length) {
        $('.colorDragging').addClass('dragging').css({
          'margin-top': 0,
          'margin-left': 0
        });
      }
      ui.cursorFeedback();
    }
    if ($('.propertyScrubber').hasClass('show')) {
      if (cache.swipe) {
        property.setNumValue();
      } else {
        if (Math.abs(cache.stop[1] - cache.start[1]) > 20 || Math.abs(cache.stop[0] - cache.start[0]) > 20) {
          if (!$(e.target).is('.propertyScrubber, .propertyScrubber *')) {
            ui.scrubber(false);
          }
        }
      }
    }
    if (cache.resizingModule) {
      switch (cache.resizingModule) {
        case 'bottom':
          var increaseWidth = cache.stop[1] - cache.start[1];

      }
    }
  }).mouseup(function(e) {
    if (tool.type == 'selection' && cache.press) {
      $('.selection').css('display','none');
    }
    if (cache.dragColor) {
      ui.sendColor();
      cache.dragColor = false;
    }
    if (svg.finished) {
      $('.selection').css('display','block');
      ui.resizeHandles(true);
      draw.selection(cache.ele);
    }
    if (pressed.handle) {
      draw.selection(cache.ele);
      layers.update();
    }
    cache.press = false;
    pressed.handle = false;
    pressed.element = false;
    svg.created = false;
    cache.swipe = false;
    if (cache.dragTab) {
      tabStates.adjustPos();
      cache.dragTab = false;
    }
    $('.outline').remove();
    $('.outline2').remove();
    $('.draggingPreview, .draggingPreview2').remove();
    $('.numberPreview').css('display','none');
    if ($('.propertyScrubber').hasClass('show')) {
      //cache.start = [e.clientX,e.clientY];
    }
    layers.select = false;
    layers.selecting = false;
    layers.reorder = false;
    cache.resizingModule = false;
    //$('.layers div').removeClass('drop-above drop-below drop-group');
  }).keydown(function(e) {
    if ($('.propertyScrubber').hasClass('show')) {
      if (e.which >= 48 && e.which <= 57) {

      }
    }
  });

  $('.propertyScrubber').mousedown(function(e) {
    cache.swipe = true;
    cache.start = [e.clientX,e.clientY];
  });

  $('.draggable').mousedown(function(e) {
    if ($(e.target).is('.drag, .drag *') && e.which == 1) {
      cache.dragTab = true;
      cache.start = [e.clientX - $(this).offset().left, e.clientY - $(this).offset().top];
    }
    else if ($(e.target).is('.drag, .drag *') && e.which == 3) {
      $(this).attr('data-resetPos',true);
    }
    tabStates.indexUp($(this));
  }).mouseup(function(e) {
    if ($(this).attr('data-resetPos') == 'true' && $(e.target).is('.drag, .drag *')) {
      tabStates.setTabs($(this));
      if ($(this).hasClass('color')) {
        tabStates.color.expand(false);
      }
    }
    tabStates.adjustPos();
    $(this).attr('data-resetPos',false);
  }).dblclick(function(e) {
    if ($(e.target).is('.drag, .drag *')) {
      util.warn('Are you sure you want to reset all toolbar positions?','resetTabs');
    }
  });

  $('.shapes').on('click', 'div', function(e) {
    $('[aria-label="fill"]').removeAttr('disabled');
    tool.type = $(this).attr('id');
  });


    // Color Module

    $('.color .col').click(function() {
      tabStates.color.expand();
      $('.col').addClass('hideButton');
    });

    $('.color input.user').keyup(function(e) {
      $('.col').css({
        'background-color': $(this).val(),
        'color': $(this).val()
      });
      if (e.which != 9) {
        colors.search($(this).val());
      }

      if (String.fromCharCode(e.which) == '(') {
        cache.inputRGB = true;
      }


      /*
      if (e.which == 8 && cache.inputRGB) { // Backspace key is pressed
        cache.currVal -= 1;
        if (cache.currVal < 0) {
          cache.colorVal = ['','',''];
          cache.inputRGB = false;
          $('.color input.user').val('');
        } else {
          cache.colorVal[cache.currVal] = '';
        }
      }*/
    }).click(function() {
      $(this).select();
      cache.colorVal = ['','',''];
      cache.currVal = 0;
    }).keydown(function(e) {
      if (e.which == 9) {
        e.preventDefault();
        if (!colors.currNum) {
          colors.currNum = 0;
        }
        if (pressed.shiftKey) {
          colors.currNum--;
        } else {
          colors.currNum++;
        }
        if (colors.currNum > colors.cached.length || colors.currNum < 0) {
          colors.currNum = 0;
        }
        $('.color input.user').val(colors.cached[colors.currNum]);
        $('.infoPanel').removeClass('show');
      }
      /*if (e.which >= 65 && e.which <= 90) {
      } else {
        if (cache.inputRGB) {
          if (e.which >= 48 && e.which <= 57 || String.fromCharCode(e.which) == '(' ||
              String.fromCharCode(e.which) == ')' || String.fromCharCode(e.which) == ',' || e.which == 8) { // Backspace key pressed
          } else {
            e.preventDefault();
          }
        } else {
          e.preventDefault();
        }
      }*/

      /*
      if (cache.inputRGB == true) {
        e.preventDefault();
        if (e.which >= 48 && e.which <= 57) {
          cache.colorVal[cache.currVal] += String.fromCharCode(e.which);
          if (cache.colorVal[cache.currVal].length >= 3) {
            if (parseInt(cache.colorVal[cache.currVal]) > 255) {
              cache.colorVal[cache.currVal] = 255;
            }
            if (cache.currVal <= 3) {
              cache.currVal += 1;
            }
          }
          $('.color input.user').val(cache.colorType + '(' + cache.colorVal[0] + ',' + (cache.colorVal[1] ? cache.colorVal[1] : '0') + ',' + (cache.colorVal[2] ? cache.colorVal[2] : '0') + ')');

        }
      }
      */

    });

    //$('.color').mousemove(function(e) {
    //  var prevCol;
    //  if ($(e.target).is('.swatches span')) {
    //  } else {
    //
    //  }
    //});
    $('.swatches').on('click','span',function() {
      if (!$(this).hasClass('empty-space')) {
        var color = $(this).css('backgroundColor');
        $('.col').css({
          'background-color': color,
          'color': color
        });
        $('.color input.user').val($(this).attr('data-color').toUpperCase());
        if (property.colorTo != 'gradient') { // Check that the color is not a gradient, if it is don't change icon color
          tool[property.colorTo] = color;
          cache.ele.attr(property.colorTo,color);
          if (cache.ele.css(property.colorTo)) {
            cache.ele.css(property.colorTo,'');
          }
        }
        colors.push('recent',color);
        $('[aria-label="'+property.colorTo+'"]').css('color',color);
        if (color == $('.color input.user').val().toUpperCase().trim() && $('.swatches span').length == 1) {
          colors.draw(colors.tab);
        }
        layers.update();
        $('.swatches span').removeClass('selectionCursor');
        $(this).addClass('selectionCursor');
        tabStates.color.selectSwatch();
      }
      //cache.ele.attr()
    }).on('contextmenu','span',function(e) {
      if (pressed.shiftKey) {
        $('.swatches .selected').each(function() {
          colors.action('save',$(this));
        });
      }
      colors.action('save',$(this));
    }).on('dblclick', 'span', function(e) {
      if (pressed.shiftKey) {
        $('.swatches .selected').each(function() {
          colors.action('tune',$(this));
        });
      }
      colors.action('tune',$(this));
    }).on('mouseenter','span',function() {
      $('.infocolor').css('font-size', 16);
      tabStates.color.info($(this));
    }).on('mousedown', 'span', function(e) {
      if (!$(this).hasClass('empty-space')) {
        cache.start = [$(this).offset().left,$(this).offset().top];
        var name = $(this).attr('data-color'); // attr returns the actual exact value stored in an attribute
        var rgb = $(this).css('backgroundColor'); // getting the background color using CSS automatically returns an RGB value whether or not it was specified that way in the attribute
        var hex = util.rgb2hex(rgb);
        var hsl = util.rgb2hsl(rgb);
        if (colors.showRGB) {
          $('.infocolor .left').text(rgb);
          $('.infocolor .right').text(hsl);
        }
        if (e.which == 1) {
          if ($(this).attr('background-color') == name) { // the name is an HTML color which means it is accepted
            cache.dragColor = name;
          } else {
            cache.dragColor = rgb;
          }
        }
      }
    }).on('mouseleave','span',function(e) {
      cache.hoveringColor = false;
      setTimeout(function() {
        if (!cache.hoveringColor) {
          $('.infoPanel').removeClass('show');
        }
      }, 1000);
      if (cache.dragColor && !$('.colorDragging').length) {
        $('body').append('<span class="colorDragging"></div>');
        colors.lastScrolled = colors.scrolled[colors.tab];
        if ($('.swatches').hasClass('smallColors')) {
          $('.colorDragging').addClass('smallColors');
        }
        $('.colorDragging').css({
          'background-color': $(this).css('backgroundColor'),
          'margin-top': ($(this).offset().top + $(this).height()/2) - e.clientY,
          'margin-left': ($(this).offset().left + $(this).width()/2) - e.clientX
        });
      }
      /*if (!pressed.shiftKey) {
        var color = $('.col').css('background-color').toUpperCase();
        if (property.colorTo != 'gradient') { // Check that the color is not a gradient, if it is don't change icon color
         tool[property.colorTo] = color;
         cache.ele.attr(property.colorTo,color);
         if (cache.ele.css(property.colorTo)) {
           cache.ele.css(property.colorTo,'');
         }
       }
     }*/
    });

    $('.infoPanel').click(function() {
      if (!colors.selectingScheme) {
        $('.swatches, .infoPanel').toggleClass('smallColors');
        colors.updateRows();
        if ($('.swatches').hasClass('smallColors')) {
          if (colors.scrolled[colors.tab] < -colors.rows + 6) {
            $('.swatches').css('margin-top', -colors.rows * 16);
          } else {
            $('.swatches').css('margin-top', colors.scrolled[colors.tab] * 16);
          }
        } else {
          $('.swatches').css('margin-top', colors.scrolled[colors.tab] * 32);
        }
      }
    }).contextmenu(function() {

    });

    $(document).keydown(function(e) {
      if (cache.mapKeysTo == 'colors' && !$('.color input.user').is(':focus')) {
        var nextIndex;
        var name;
        switch (e.which) {
          case 37: // Left arrow key is pressed
            if (pressed.cmdKey || !$('.swatches .selected')) {
              tabStates.color.tab('right');
            } else {
              tabStates.color.selection('left');
            }
            break;
          case 38: // Up arrow key is pressed
            if (pressed.cmdKey || !$('.swatches .selected').length) {
              colors.scroll('up');
            } else {
              tabStates.color.selection('up');
            }
            break;
          case 39: // Right arrow key is pressed
            if (pressed.cmdKey || !$('.swatches .selected').length) {
              nextIndex = $('.category .select').index() + 1;
              if (nextIndex <= 4) {
                $('.category span').removeClass('select');
                name = $('.category span').eq(nextIndex).addClass('select');
                colors.draw(name.attr('aria-label'));
              }
            } else {
              tabStates.color.selection('right');
            }
            break;
          case 40: // Bottom key is pressed
            if (pressed.cmdKey || !$('.swatches .selected').length) {
              colors.scroll();
            } else {
              tabStates.color.selection('down');
            }
            break;
          case 32: // Spacebar is pressed
            if (pressed.shiftKey) {
              colors.scroll('shiftSpace');
            } else {
              colors.scroll('space');
            }
            break;
          case 16: // Shift key is pressed
            break;
          case 9: // Tab key is pressed
            var nextIndex = $('.category .select').index();
            if (pressed.shiftKey) {
              nextIndex -= 1;
            } else {
              nextIndex += 1;
            }
            if (nextIndex < 0) {
              nextIndex = 4;
            } else if (nextIndex > 4) {
              nextIndex = 0;
            }
            $('.category span').removeClass('select');
            name = $('.category span').eq(nextIndex).addClass('select');
            colors.draw(name.attr('aria-label'));
            break;
          case 192:
            if ($('.swatches .selected').length > 1) {
              var selected = $('.swatches .selected.selectionCursor').index();
            } else if ($('.swatches .selectedFade').length >= 1) {
              var selectedFade = $('.swatches .selected.selectionCursor').index();
            }
            $('.swatches .selectionCursor.selected')
            if (pressed.shiftKey) {
              $('.swatches .selected:first-child').addClass('selectionCursor');

            }
            if ($('.swatches .selected').length > 1) {

            }
            break;
          case 13: // Enter key is pressed
            tabStates.color.selectSwatch();
            break;
          case 83: // S is pressed
            if (!cache.delayS) {
              if (pressed.shiftKey) {
                $('.swatches .selected').each(function() {
                  colors.action('save',$(this),true);
                });
              } else {
                colors.action('save', $('.swatches .selectionCursor'), true);
              }
              cache.delayS = true;
              setTimeout(function() {
                cache.delayS = false;
              }, 250);
            }
            break;
          case 84: // T is pressed
            if (!cache.delayT) {
              if (pressed.shiftKey) {
                $('.swatches .selected').each(function() {
                  colors.action('tune', $(this), true);
                });
              } else {
                colors.action('tune', $('.swatches .selectionCursor'), true);
              }
              cache.delayT = true;
              setTimeout(function() {
                cache.delayT = false;
              }, 250);
            }
            break;
          case 8: // Backspace is pressed
            colors.action(colors.tab, $('.swatches .selectionCursor'), false);
        }
      }
    }).keyup(function() {
      tabStates.color.transitionScroll = true;
    });
    $('.color').mouseover(function() {
      cache.mapKeysTo = 'colors';
    }).mouseout(function() {

    }).mousedown('.drag-bar', function(e) {
      //cache.start = [e.clientX,e.clientY];
      if ($(this).hasClass('horizontal')) {
        if ($(this).hasClass('bottom')) {
          cache.resizingColorModule = 'bottom';
        }
        if ($(this).hasClass('top')) {
          cache.resizingColorModule = 'bottom';
        }
      } else if ($(this).hasClass('vertical')) {
        if ($(this).hasClass('right')) {
          cache.resizingColorModule = 'right';
        }
        if ($(this).hasClass('left')) {
          cache.resizingColorModule = 'left';
        }
      }
    }).mousedown('.drag-corner', function() {
      cache.resizingModule = $(this).attr('class').split(' ')[1];
    });
    var properties = {
      update: function() {
        //blu
      }
    }




    $('.layers .all').on('mouseenter', 'div', function(e) {
      /*cache.ele = $(e.target).attr('id');
      draw.selection(true);*/
    }).on('mousedown','div',function(e) {
      if (e.which == 1) { // Right Click
        ui.resizeHandles(true);
        cache.start = [e.clientX,e.clientY];
        layers.select = true;
        layers.selectedLayer = false;
        layers.current = $(this);
        $('.selection').css('display','block');
        //cache.ele = $(this).attr('id');
        //draw.selection(cache.ele);
      }
    }).on('mouseup', 'div', function(e) {
      if (e.which == 1) {
        if (layers.reorder) {
          layers.drop($(this));
        } else if (!layers.selecting) {
          var selected = $(this).hasClass('selected');
          if (pressed.shiftKey) {
            if (selected) {
              $(this).removeClass('selected');
            } else {
              $(this).addClass('selected');
            }
          } else {
            $('.layers div').removeClass('selected');
            $(this).addClass('selected');
          }
        }
        $('.draggingLayer').remove();
        $('.layers div').removeClass('drop-above drop-below drop-group');
      } else if (e.which == 3) {
        $(this).toggleClass('hidden');
        if ($(this).css('display')) {
          $(this).css('display','');
        }
        if ($(this).hasClass('hidden')) {
          $('#editor #' + $(this).attr('id')).attr({'display': 'none'});
        } else {
          $('#editor #' + $(this).attr('id')).removeAttr('display');
        }
        if (!pressed.shiftKey) {
          if ($('.layers .selected').length > 1 && $(this).hasClass('selected')) {
            if ($(this).hasClass('hidden')) {
              $('.layers .selected').addClass('hidden');
              $('.layers .selected').each(function() {
                $('#editor #' + $(this).attr('id')).attr({'display': 'none'});
              });
            } else {
              $('.layers .selected').removeClass('hidden');
              $('.layers .selected').each(function() {
                $('#editor #' + $(this).attr('id')).removeAttr('display');
              });
            }
          }
        }

      }
    }).on('mouseleave','div',function() {
      if (layers.reorder) {
        $('.layers div').removeClass('drop-above drop-below drop-group');
      } else if (layers.select) {
        if (pressed.shiftKey) {
          layers.selecting = true;
          $(this).addClass('selected');
        } else {
          layers.reorder = true;
        }
      }
      if (cache.start[1] < cache.stop[1]) {
        $(this).addClass('layerAboveCursor');
      }
    }).on('mouseenter','div',function() {
      if (layers.reorder) {
        ui.showDropArea($(this));
      } else if (layers.selecting) {
        $(this).addClass('selected');
      }
    }).on('mousemove', 'div', function() {
      if (layers.reorder) {
        ui.showDropArea($(this));
      }
    }).mouseleave(function() {
      if (layers.reorder) {
        $('.draggingLayer').remove();
      }
    });




    $('.properties div').click(function() {
      if (!$(this).attr('disabled') && $(this).is('[data-icon]')) {
        if (!$(this).is('[data-icon=""]')) {
          property.colorTo = $(this).attr('aria-label');
        }
        if (!$('.color').hasClass('expand')) {
          tabStates.color.expand(true);
          tabStates.color.quickView = true;
          tabStates.color.keepOpen = false;
        }
        if (!pressed.shiftKey) {
          if ($(this).is('[aria-label="stroke"], [aria-label="fill"]')) {
            $('.properties div[aria-label="stroke"], .properties div[aria-label="fill"]').removeClass('toggled');
          }
        }
        if ($(this).is('[aria-label="opacity"]')) {
          $(this).toggleClass('toggled');
        } else {
          $(this).addClass('toggled');
        }
      }
      if ($(this).is('[aria-label="stroke"], [aria-label="fill"]')) {
        if ($(this).hasClass('toggled')) {
          $('.properties div').removeClass('fill');
          $(this).addClass('fill');
        }
      } else if ($(this).is('[aria-label="gradient"], [aria-label="texture"]')) {
        $('.properties div').removeClass('fill');
        $(this).addClass('fill');
      }
    }).mousedown(function() {
      cache.swipe = true;
      property.scrubberTo = $(this);
      cache.btnArea = {
        left: $(this).offset().left,
        right: $(this).offset().left + $(this).width(),
        top: $(this).offset().top,
        bottom: $(this).offset().top + $(this).height()
      };
    }).mouseleave(function(e) {
      if (cache.swipe && !$('.propertyScrubber').hasClass('show')) {
        cache.start = [e.clientX,e.clientY];
        if (e.clientX > cache.btnArea.left && e.clientX < cache.btnArea.right) {
          cache.start = [e.clientX,e.clientY];
          if (e.clientY < cache.btnArea.top + 5) {
            ui.scrubber(true);
          }
          if (e.clientY > cache.btnArea.bottom - 5) {
            ui.scrubber(true,'down');
          }
        }
        property.setNumValue();
      }
    }).contextmenu(function(){
      /*if ($(this).is('[aria-label="stroke"]')) {
        if (parseInt(cache.ele.attr('stroke-opacity')) > 0) {
          cache.ele.attr('stroke-opacity',0);
          cache.ele
        } else {
          cache.ele.attr('stroke-opacity',tool.strokeOpacity);
        }
      }*/
      if ($(this).is('[aria-label="stroke"]')) {
        if (cache.ele.attr('paint-order') == 'stroke') {
          cache.ele.removeAttr('paint-order');
          tool.paintOrder = '';
          cache.ele.attr('stroke-opacity',0);
          setTimeout(function() {
            cache.ele.attr('stroke-opacity',tool.strokeOpacity);
          }, 0);
          $(this)
        } else {
          cache.ele.attr('paint-order','stroke');
          tool.paintOrder = 'stroke';
          cache.ele.attr('stroke-opacity',0);
          setTimeout(function() {
            cache.ele.attr('stroke-opacity',tool.strokeOpacity);
          },0);
        }
      }
    })
    $('.actions div').click(function(e) {
      switch ($(e.target).attr('id')) {
        case 'move-up':
          layers.moveUp();
          break;
        case 'move-back':
          layers.moveBack();
          break;
        case 'grid':
          $('[aria-label="grid"]').toggleClass('on');
      }
    }).dblclick(function(e) {
      switch ($(e.target).attr('id')) {
        case 'move-up':
          layers.moveUp(true);
          break;
        case 'move-back':
          layers.moveBack(true);
          break;
      }
    });



    

    var last, diff;
    $('.color').on('wheel', function(e) {
      if (!$(this).hasClass('expand')) {
        tabStates.color.quickView = true;
        tabStates.color.expand(true);
      }
      if (e.originalEvent.deltaY > 0) { // scrolling downward
        colors.scroll();
      }
      if (e.originalEvent.deltaY < 0) { // scrolling upward
        colors.scroll('up');
      }
      tabStates.indexUp($(this));
    }).mouseleave(function(e) {
      setTimeout(function() {
        if (tabStates.color.quickView && !tabStates.color.keepOpen && !colors.animating) {
          tabStates.color.expand(false);
        }
      }, 1000);
      tabStates.color.keepOpen = false;
    }).mouseenter(function() {
      if (tabStates.color.quickView) {
        tabStates.color.expand(true);
        tabStates.color.keepOpen = true;
      }
    });

    $('.color').on('contextmenu mouseup', '.colorCat li', function() {
      var color = $(this).text();
      $('.color input.user').val(color);
      switch (color) {
        case 'GREY':
          colors.search('WHITE GREY');
          break;
        case 'RED':
          colors.search('RED ORANGE PINK');
          break;
        case 'YELLOW':
          colors.search('YELLOW BROWN');
          break;
        default:
          colors.search(color);
      }
    }).on('mouseup', '.schemes li', function() {
      ui.selectScheme($(this));
    }).on('mousemove', '.schemes li', function(e) {
      var marginSize = 4;
      var cursorAreaW = $(this).width()-marginSize*2;
      var offsetX = e.clientX - $(this).offset().left - marginSize;
      var percentage = offsetX / cursorAreaW;
      var amountScroll = -($(this).children('.colorsPreviewScroll').width() - $(this).width());
      var leftMargin = percentage * amountScroll;
      if (leftMargin > 0) {
        leftMargin = 0;
      }
      if (leftMargin < amountScroll) {
        leftMargin = amountScroll;
      }
      $(this).children('.colorsPreviewScroll').css('left',leftMargin);
    }).on('contextmenu', '.schemes li', function() {

    });

    $('.color .drag-bar.vertical.right').mousedown(function(e) {

    });

    $('.category span').click(function() {
      var label = $(this).attr('aria-label');
      colors.draw(label);
      $('.schemes, .colorCat').removeClass('view');
      $('.category span').removeClass('select');
      $(this).addClass('select');
      $('[aria-label="palette"]').text('sort');
      $('.swatches').attr('data-category',label);
    }).contextmenu(function() {
      switch ($(this).attr('aria-label')) {
        case 'palette':
          colors.draw('palette');
          colors.showSchemes();
          $('[aria-label="palette"]').text('filter_list');
          break;
        case 'recent':
          break;
        case 'saved':
          break;
      }
    }).mousemove(function() {

    }).mousedown(function() {
      $('.infoPanel').removeClass('show');
    });

    colors.draw();

    $(document).on('wheel',function(e) {
      if (!$(e.target).is('.tools *') && !$(e.target).is('.animatable')) {
        if (e.originalEvent.deltaY > 0) { // scrolling up - zooming out
          if (doc.zoom > 1 || doc.size[0]*doc.zoom > $(window).width() || doc.size[1]*doc.zoom > $(window).height()) {
            doc.zoom -= 0.25;
            if (doc.zoom > 10) {
              doc.zoom -= 0.5;
            }
          }
        }
        if (e.originalEvent.deltaY < 0) { // scrolling down - zooming in
          if (doc.zoom < 20) {
            doc.zoom += 0.25;
            if (doc.zoom < 10) {
              doc.zoom += 0.5;
            }
          }
        }
        var offsetTop = ($(window).height()/2 - e.clientY) * doc.zoom;
        var offsetLeft = ($(window).width()/2 - e.clientX) * doc.zoom;
        if (doc.zoom <= 1) {
          offsetTop = ($(window).height() - doc.size[1]*doc.zoom)/2;
          offsetLeft = ($(window).width() - doc.size[0]*doc.zoom)/2;
        }
        $('#editor').css({
          'transform': 'scale('+doc.zoom+')',
          'top': offsetTop,
          'left': offsetLeft
        });
        draw.selection(cache.ele);
      }
  });

  function readAndInsert(file) {
    var reader = new FileReader();
    var image = new Image();
    image.src = this.result;
    var width = 100;
    var height = 100;
    reader.readAsDataURL(file);
    reader.onload = function() {
      tool.images.push({
        result: this.result,
        width: width,
        height: height
      });
    }
  }

  $('#inputFile').change(function(e) {
    tool.images = [];
    var files = e.target.files;
    tool.imageIndex = files.length-1;
    tool.prevIndexIMG = files.length-1;
    for (var i = 0; i < files.length; i++) {
      readAndInsert(files[i]);
    }
  });

  $('#image').contextmenu(function() {
    $('#inputFile').trigger('click');
  });

  ui.colorListPreview();
});
