'use strict';

var summaryUrlOfId = require('./summary-url-of-id');

function summary(id) {
    var url = summaryUrlOfId(id);

    console.log('summary', url);

    return url;
}

module.exports = summary;