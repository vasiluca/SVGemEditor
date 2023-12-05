import { Circle } from './CanvasElements/Elements/Element/Circle.js';
import { Export } from './Tab/Action/Export.js';

//Modify the file with a circle element and then export
test('Create Circle and Export', () => {
    // Example circle parameters
    const cx = 50;
    const cy = 50;
    const r = 30;

    // Create a Circle element
    const circleAttr = Circle.createAttr(cx, cy, r);

    // Export the Circle
    const exportedData = Export(circleAttr, 'circle.svg', 'image/svg+xml');

    expect(exportedData).toContain('<svg');
    expect(exportedData).toContain('cx="50"');
    expect(exportedData).toContain('cy="50"');
    expect(exportedData).toContain('r="30"');
  });
