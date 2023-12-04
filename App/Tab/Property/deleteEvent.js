/* delete label */

import { cache } from "../../Cache.js";
import { deleteButton } from "./DeleteButton.js"; 

$('[aria-label="delete"]').mousedown(function() {
    cache.btnAction = 'delete';
    console.log("delete pressed");
});

$(document).mousemove(function(e) {
    if (cache.btnAction === 'delete') {
        deleteButton.handleDelete();
    }
}).mouseup(function() {
    cache.btnAction = '';
});