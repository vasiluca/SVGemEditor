//** This provides functionality that is shared among new SVG elements and editing existing SVG elements */
/** This functionality includes:
 * - Drawing the selection area box (shown after an element is created or edited)
 * - Having an Object which can be referenced to point to the static Object
 */

import { cache, pressed } from '../../Cache.js';
import { doc } from '../../SetUp.js';
import { draw } from './Draw.js';

import { Line } from '../Elements/Element/Line.js';
import { Circle } from '../Elements/Element/Circle.js';
import { Ellipse } from '../Elements/Element/Ellipse.js';
import { Rectangle } from '../Elements/Element/Rectangle.js';

import { tool } from '../../Tab/Tool.js';

//** This gives us easy access to Element Object functions, without requiring us to use a switch statement */
//** This is because JavaScript allows us to access object properties using this syntax:  Obj["key"] */
//** Which means we can pass in the object property we want to access as a String */
// Each of these type keys on the left should match the name given to the SVG element tags
var element = {
  line: Line,
  circle: Circle,
  ellipse: Ellipse,
  rect: Rectangle
}

var translateX = 0;
var translateY = 0;
var svg = {
    numID: 0, // each time a new element is added, the ID is incremented
    created: false,
    // new: function(ele, attr, id) {
    //   if (svg.created == false) {
    //     if (!id) {
    //       id = this.numID;
    //       this.numID++;
    //     }
    //     // the below code simply append to the HTML Document
    //     $('#editor').html($('#editor').html() + '<' + ele + ' id=' + id + '/>');
    //     this.id = '#' + id;
    //     cache.ele = id;
    //     this.created = true;
    //     this.finished = false;
    //   }
    //   attr['stroke-width'] = tool.strokeWidth;
    //   attr.stroke = tool.stroke;
    //   if (ele != 'line' && ele != 'polyline') {
    //     attr['paint-order'] = tool.paintOrder;
    //   }
    //   $(this.id).attr(attr);
    // },

    resize: function(axis) {
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
      // if (direction != undefined) {
      //   switch (direction) {
      //     case 'right':
      //       translateX = cache.moveAmount;
      //       break;
      //     case 'left':
      //       translateX = -cache.moveAmount;
      //       break;
      //     case 'up':
      //       translateY = -cache.moveAmount;
      //       break;
      //     case 'down':
      //       translateY = cache.moveAmount;
      //       break;
      //   }
      // }
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

    setColor: function() {

    },
    pathData: []
}

export { svg, element };