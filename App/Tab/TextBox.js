import { cache } from '../../Cache.js';
import { tool } from "../Tool.js";

export function createTextbox(event) {
    console.log("Textbox creation triggered", tool.type);
    if (tool.type === 'textbox') {
        var pos = cache.pos(event.clientX, event.clientY);
        var textbox = document.createElement('input');
        textbox.type = 'text';
        textbox.style.position = 'absolute';
        textbox.style.left = pos[0] + 'px';
        textbox.style.top = pos[1] + 'px';
        //enables the textbox to move around
        textbox.setAttribute('draggable', true);
        textbox.addEventListener('dragstart', dragStart);
        textbox.addEventListener('dragend', dragEnd);
        document.body.appendChild(textbox);
        textbox.focus();
    }
}

export function dragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
    offsetX = event.clientX - event.target.getBoundingClientRect().left;
    offsetY = event.clientY - event.target.getBoundingClientRect().top;
}
export function dragEnd(event) {
    const id = event.dataTransfer.getData('text/plain');
    const textbox = document.getElementById(id);
    const x = event.clientX - offsetX;
    const y = event.clientY - offsetY;
    textbox.style.left = x + 'px';
    textbox.style.top = y + 'px';
}
// Add event listener to the canvas
document.getElementById('editor').addEventListener('mousedown', createTextbox);

export { textbox };