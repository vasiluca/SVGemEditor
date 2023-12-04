//add and resize function for image files on local computer
import { tool } from './Tab/Tool.js';
import { layers } from './Tab/Layer.js';
import { pressed } from '../Cache.js';

export function handleImageAdd(e, newWidth, newHeight) {
  if (tool.name === 'image' && tool.imageIndex !== -1) {
    const selection = tool.images[tool.imageIndex];
    const posX = e.clientX - selection.width / 2;
    const posY = e.clientY - selection.height / 2;

    // Determine if resizing or adding a new image
    if (newWidth && newHeight) { //means that newWidth and newHeight are not null or undefined
      // Resizing the image
      handleResize(posX, posY, newWidth, newHeight);
    } else {
      // Adding a new image with fixed dimensions
      addImage(posX, posY, 500, 'auto');
    }

    // Decrement imageIndex and switch to 'selection' tool type
    if (!pressed.ctrlKey && tool.imageIndex > -1) {
      tool.imageIndex--;
    }
    // Selection mode only, no image was added.
    if (tool.imageIndex === -1) {
      tool.type = 'selection';
    }
  }
}

// Function to add an image
function addImage(posX, posY, height, width) {
  const selection = tool.images[tool.imageIndex];
  const element = `<image xlink:href="${selection.result}" height="${height}" width="${width}" x="${posX}" y="${posY}"/>`;

  // Move the updated layer to the top -- added
  layers.moveUp();

  // Append the new image element to the editor
  $('#editor').html($('#editor').html() + element);
}

// Function for the resizing -- added
function handleResize(imageId, posX, posY, newWidth, newHeight) {
  // Find the image element using the ID
  const imageElement = $('#' + imageId);

  // Update the position and size attributes of the image element
  imageElement.attr({
    'x': posX,
    'y': posY,
    'width': newWidth,
    'height': newHeight
  });

  console.log(`Resized: x=${posX}, y=${posY}, width=${newWidth}, height=${newHeight}`);
}