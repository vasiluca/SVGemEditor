//** This provides the necessary functions to create an SVG element */

import { cache, pressed } from '../../Cache.js';

import { svg } from './SVG.js';

import { tool } from '../../Tab/Tool.js';

var draw = {
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