'use strict';

var _ = require('lodash');

function ratingLabelOfNumber(num) {

    if (_.isUndefined(num)) {
        throw new Error('ratingLabelOfNumber: num is required, but was: ' + num);
    }

    return [
        'Excellent',
        'Good',
        'Fair',
        'Poor'
    ][num]
}

module.exports = ratingLabelOfNumber;