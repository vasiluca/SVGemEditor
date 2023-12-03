import { cache } from '../../Cache.js';

import { tool } from '../Tool.js';

import { property } from '../../Tab/Property.js';

var Opacityproperty = {
    setOpacity: function() {
        var opacityChange = cache.stop[1] - cache.start[1];
        var opacity = cache.ele.css('opacity') || 1;

        opacity = parseFloat(opacity) + opacityChange;

        // Ensure opacity is within the valid range (0 to 1)
        opacity = Math.max(0, Math.min(1, opacity));

        cache.ele.css('opacity', opacity);
        tool.strokeOpacity = opacity;
        tool.fillOpacity = opacity; 

    }
};

export { Opacityproperty };
