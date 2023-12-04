import { createTextbox } from '../../Tab/TextBox'
import { dragStart } from '../../Tab/TextBox'
import { dragEnd } from '../../Tab/TextBox'


test('successfully created a text box', () => {
    var mockEvent = { clientX: 100, clientY: 200 }; // Example coordinates
    var expectedX = 100;
    var expectedY = 200;
    var textbox = createTextbox();
    expect(textbox).not.toBeNull();
    expect(textbox.style.position).toBe('absolute');
    var actualX = parseInt(textbox.style.left, 10);
    var actualY = parseInt(textbox.style.top, 10);
    if (actualX === expectedX && actualY === expectedY) {
        console.log("Textbox is at the expected position.");
    }
    else {
        console.log("Textbox is NOT at the expected position.");
    }
   
});

test('successfully moved a text box to a different position', () => {
    const mockEvent = { clientX: 100, clientY: 200 };
    const textbox = createTextboxAtCursor(mockEvent);
    // Mock dragstart event
    const mockDragStartEvent = {
        dataTransfer: {
            setData: jest.fn(),
            getData: jest.fn(() => 'myTextbox')
        },
        clientX: 100,
        clientY: 200
    };
    dragStart(mockDragStartEvent);
    // Mock new position and dragend event
    const mockDragEndEvent = {
        dataTransfer: {
            getData: jest.fn(() => 'myTextbox')
        },
        clientX: 200, // New X position
        clientY: 300  // New Y position
    };
    dragEnd(mockDragEndEvent);
    // Check if the position of the textbox has been updated
    expect(textbox.style.left).toBe('200px');
    expect(textbox.style.top).toBe('300px');
});