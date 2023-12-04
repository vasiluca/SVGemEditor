import { cache } from '../../Cache.js';
import { tool } from "../Tool.js";


export function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    var offsetX = event.clientX - event.target.getBoundingClientRect().left;
    var offsetY = event.clientY - event.target.getBoundingClientRect().top;
}
export function dragEnd(event) {
    var offsetX = event.clientX - event.target.getBoundingClientRect().left;
    var offsetY = event.clientY - event.target.getBoundingClientRect().top;
    const id = event.dataTransfer.getData('text/plain');
    const textbox = document.getElementById(cache.svgID);
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    textbox.style.left = x + 'px';
    textbox.style.top = y + 'px';
}

var svgCanvas = document.getElementById("editor");

export function createTextbox(event) {
    console.log("Textbox creation triggered", tool.type);
    if (tool.type == 'text') {
        var pos = cache.start;
        var textbox = document.createElement('input');
        var svgEditor = document.getElementsByClassName("svg-contain")[0];
        textbox.type = 'text';
        textbox.style.position = 'absolute';
        textbox.style.left = pos[0] + 'px';
        textbox.style.top = pos[1] + 'px';
        textbox.style.border = '1px solid black';
        //enables the textbox to move around
        textbox.setAttribute('draggable', true);
        textbox.setAttribute('class', 'drag');
        textbox.addEventListener('dragstart', dragStart);
        textbox.addEventListener('dragend', dragEnd);
        svgEditor.appendChild(textbox);
        textbox.focus();
    }
}

// Add event listener to the canvas
svgCanvas.addEventListener('mouseup', createTextbox);