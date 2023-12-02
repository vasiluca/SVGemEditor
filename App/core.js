import { cache, pressed } from './Cache.js';
import { doc } from './SetUp.js';
import { tabStates, util } from './Tabs.js';
import { ui } from './UI.js';

import { svg } from './CanvasElements/Modify/SVG.js';
import { select } from './CanvasElements/Selection.js';
import * as SelectionEvents from './CanvasElements/SelectionEvents.js';
import * as Events from './CanvasElements/Events.js'; // No Objects exported there are event functions

import { tool } from './Tab/Tool.js'
import { colors } from './Tab/Color.js';
  import * as ColorEvents from './Tab/Events/Color.js';
import { property } from './Tab/Property.js';
import * as actions from './Tab/Action.js'; // No objects are actually exported frmo Action.js yet
import { layers } from './Tab/Layer.js';
  import * as LayerEvents from './Tab/Events/Layer.js';

$(document).ready(function() {




  $('#editor').mousemove(function(e) {
    if ($(e.target).is('#editor *') && cache.press == false && tool.type == 'selection' && !pressed.handle) {
      cache.hoverEle = $(e.target).attr('id');
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
    if (cache.dragTab == true) {
      tabStates.focused.css({
        'left': e.clientX - cache.start[0],
        'top': e.clientY - cache.start[1],
        'bottom': 'auto',
        'right': 'auto'
      });
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
    cache.resizingModule = false;
    //$('.layers div').removeClass('drop-above drop-below drop-group');
  }).keydown(function(e) {
    if ($('.propertyScrubber').hasClass('show')) {
      if (e.which >= 48 && e.which <= 57) {

      }
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


















  




















  //** From this point, onward is non-crucial functionality or jQuery events (not as important to test) */
  // TODO: add the the below functions to their corresponding modules
  
  $('.propertyScrubber').mousedown(function(e) {
    cache.swipe = true;
    cache.start = [e.clientX,e.clientY];
  });

  $('.shapes').on('click', 'div', function(e) {
    $('[aria-label="fill"]').removeAttr('disabled');
    tool.type = $(this).attr('id');
  });
  
  $(document).mousedown(function(e) {
    if ($('.propertyScrubber').hasClass('show') && !$(e.target).is('.propertyScrubber, .propertyScrubber *')) {
      $('.propertyScrubber').removeClass('show');
    }
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
          'left': offsetLeft,
          'transition': '0s'
        });
        select.area(cache.ele);
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
  
});