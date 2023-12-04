import { addImage} from './Tab/Images.js';
import { handleResize} from './Tab/Images.js';

// test for the add function
test('should add image to tool.images', () => {
    // Sample values
    const posX = 100;
    const posY = 200;
    const height = 120;
    const width = 150;

    // Create an image object for testing
    const tool = {
      name: 'image',
      imageIndex: 0, //First image
      images: [{ result: 'sampleImage.jpg' }], // Initial images array
    };

    // Call the function
    addImage(posX, posY, height, width, tool);

    expect(tool.images.length).toBe(1); // Check if the number updated
    expect(tool.images[1].result).toBe('sampleImage.jpg'); // Check the added image details
  });

//test for the resize function

test('should resize the image element', () => {
    //Sample values
    const imageId = 'mockImage';
    const posX = 150;
    const posY = 250;
    const newWidth = 200;
    const newHeight = 180;

    //Sample image added
    const mockImageElement = document.createElement('image');
    mockImageElement.setAttribute('id', imageId);
    document.body.appendChild(mockImageElement);

    // Call the function
    handleResize(imageId, posX, posY, newWidth, newHeight);

    // Perform assertions or use Jest's expect statements
    // For example, check if the image element attributes were updated
    expect(mockImageElement.getAttribute('x')).toBe(`${posX}`);
    expect(mockImageElement.getAttribute('y')).toBe(`${posY}`);
    expect(mockImageElement.getAttribute('width')).toBe(`${newWidth}`);
    expect(mockImageElement.getAttribute('height')).toBe(`${newHeight}`);

    // Clean up: remove the mock image element from the document
    document.body.removeChild(mockImageElement);
  });
