import { cache, pressed } from './Cache.js';
import { doc } from './SetUp.js';
import { tabStates, util } from './Tabs.js';
import { ui } from './UI.js';

import { svg } from './CanvasElements/Main/SVG.js';
import { draw } from './CanvasElements/Main/Draw.js';
import * as events from './CanvasElements/Events.js'; // No Objects exported there are event functions

import { tool } from './Tab/Tool.js'
import { colors } from './Tab/Color.js';
import { property } from './Tab/Property.js';
import * as actions from './Tab/Action.js'; // No objects are actually exported frmo Action.js yet
import { layers } from './Tab/Layer.js';

$(document).ready(function() {

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
    // // TODO: move cache.stop & top 3 ifs to Events
// cache.stop = [e.clientX,e.clientY];
//       if (cache.press && tool.type != 'selection') {
//         draw[tool.type]();
//       }
//       if (pressed.handle) {
//         svg.resize();
//       }
//       if (pressed.element) {
//         svg.move();
//       }
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
// cache.press = false; // TODO: cache, pressed, svg already moved to events, remove this comment block
//       pressed.handle = false;
//       pressed.element = false;
//       svg.created = false;
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













  // TODO: TO be organized later
//** Color functions included below */


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

    ui.colorListPreview(); 
});
