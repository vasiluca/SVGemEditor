/** This file stores all data that is temporary, and needed only for the current application session */

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

export {cache, pressed};