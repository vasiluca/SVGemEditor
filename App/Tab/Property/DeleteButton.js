/* This deletes an element when the delete icon is pressed */ 

import { cache } from '../../Cache.js';

import { tool } from '../Tool.js';

import { property } from '../Property.js';

var deleteButton = {
    initialize: function () {
        // delete element in html
        $('.material-icons[aria-label="delete"]').on('click', this.handleDelete);
    },

    handleDelete: function () {
        // Check if there are selected elements in the cache
        if (cache.selectedElements.length > 0) {
            // Iterate through selected elements and remove them
            cache.selectedElements.forEach(function (element) {
                element.remove();
            });

            // Clear the selection and update layers
            cache.selectedElements = [];
            layers.update();
        }
    }
};

export { deleteButton };