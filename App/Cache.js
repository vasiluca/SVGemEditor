/** This file stores all data that is temporary, and needed only for the current application session */

import { tool } from './Tab/Tool.js';

var cache = {
    size: [],
    start: [],
    stop: [],
    press: false,
    zoom: 0,
    zoomed: false,
    pos: function(x, y) {
      return [x-$('#editor')[0].getBoundingClientRect().left, y-$('#editor')[0].getBoundingClientRect().top];
    },
    svgID: 0,
    set ele(val) {
      this.svgID = val;
    },
    get ele() {
      return $('#editor #'+this.svgID);
    },
    set hoverEle(val) {
      this.hovering = val;
    },
    get hoverEle() {
      return $('#'+this.hovering);
    },
    selectedElements: [],
    dragTab: false,
    mapKeysTo: 'selection',
    moveAmount: 2
}

var pressed = {
    handle: false, // this refers to the blue handlebars that can resize a selected element
    shiftKey: false,
    ctrlKey: false,
    altKey: false,
    cmdKey: false,
    tabKey: false
}

$(window).blur(function() { // this ensures that when the user switches windows, all keypress states are reset
    for (var prop in pressed) {
      pressed[prop] = false;
    }
    console.log('window blurred');
});

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
  })

export {cache, pressed};