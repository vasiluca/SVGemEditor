//** These tests have to do with moving and resizing various elements */
//** These tests are self-contained and will be able to run on their own */
/**
 * These tests are not yet fully functional (due to the refactoring process)
 */

test(" Resizing Area of Rectangle ", () => {
	rect();
	let old_width = cache.ele.attr("width");
	let old_height = cache.ele.attr("height");
	pressed.cmdkey = true;
	rect();
	let new_width = cache.ele.attr("width")
	let new_height = cache.ele.attr("height")
	if ((old_width * height) == (new_width * new_height)){
		throw new Error("Rectangle not resized");
	}
});

test(" ...Move Rectangle... ", () => {
	rect();
	let old_x = cache.ele.attr("width");
	let old_y = cache.ele.attr("height");
	if ((old_x < 0) || (old_y < 0)) {
		throw new Error("Rectange not moved");
	}
	expect(old_x).toBe(0);
	expect(old_y).toBe(0);
	move(10, 34);
	expect(old_x).toBe(10);
	expect(old_y).toBe(34);
});


test("Resizing Length of Line", () => {
  	line(); // Create the initial line
  	
	// Store the old coordinates
  	let old_x1 = cache.start[0];
  	let old_y1 = cache.start[1];
  	let old_x2 = cache.stop[0];
  	let old_y2 = cache.stop[1];

  	line(); // Creating the new line

  	// Store the new coordinates
  	let new_x1 = cache.start[0];
  	let new_y1 = cache.start[1];
  	let new_x2 = cache.stop[0];
  	let new_y2 = cache.stop[1];

	// Calculating the lengths of the initial and new lines, using the distance formula
	let oldLength = Math.sqrt(Math.pow(initial_x2 - initial_x1, 2) + Math.pow(initial_y2 - initial_y1, 2));
	let newLength = Math.sqrt(Math.pow(new_x2 - new_x1, 2) + Math.pow(new_y2 - new_y1, 2));

	// Checking if the length has changed
	if (initialLength == newLength) {
		throw new Error("Line not resized");
	}
});


test(" Resize Circle ", () => {
	// Create a circle
	circle();
	
	// Get radius of circle
	let prevRadius = cache.ele.attr("r");
	
	// Simulate action that initiates resizing 
	pressed.cmdkey = true;
	
	// Create new circle
	circle();
	
	// Get new radius of circle
	let currRadius = cache.ele.attr("r");
	
	// Check if circle was resized
	if (prevRadius == currRadius) {
		throw new Error("Circle was not resized");
	}

});

test("Moving the circle relatively", () => {
	curr = circle();
	expect(curr.x).toBe(0);
	expect(curr.y).toBe(0);
	curr.move(20, 10);
	expect(curr.x).toBe(20);
	expect(curr.y).toBe(10);
	curr.move(-10, 10);
	expect(curr.x).toBe(10);
	expect(curr.y).toBe(20);
});

test('Moving the circle objectively', () => {
    curr = circle();
    expect(curr.x).toBe(0);
    expect(curr.y).toBe(0);
    curr.moveTo(20, 10);
    expect(curr.x).toBe(20);
    expect(curr.y).toBe(10);
    curr.moveTo(40, 50);
    expect(curr.x).toBe(40);
    expect(curr.y).toBe(50);
});