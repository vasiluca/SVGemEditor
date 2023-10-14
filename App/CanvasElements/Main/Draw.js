//** This provides the necessary functions to create an SVG element */

import { cache, pressed } from '../../Cache.js';

import { svg } from './SVG.js';

import { tool } from '../../Tab/Tool.js';

var draw = {
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

    //** This selection function adjusts the selection area over a selected SVG element */ */
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
    },
      // if (tool.type != 'selection') {
      //   svg.selectionAreas[svg.numID - 1] = obj;
      // }
    
    //** For now try to focus on testing the existing functions */
    // TODO: Most important is to implement text, polyline, and polygon
    text: function() {},
    polyline: function() { // The function for creating a polyline element
    },
    polygon: function() { // The function for creating a polygon element
    },
    
    path: function() { // The function for creating a path element
      if (!svg.created) {
        svg.pathData = cache.ele.attr('d').split(' ');
      }
      svg.new('path', {
        d: "M " + cache.start[0] + "," + cache.start[1]
      });
    },
    brush: function() {}
}

export { draw }