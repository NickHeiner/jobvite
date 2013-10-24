'use strict';

var q = require('q'),
    _ = require('lodash');

function qNotify(val) {
    var deferred = q.defer();
    setTimeout(_.partial(deferred.notify, val), 200);
    setTimeout(_.partial(deferred.resolve, 'notify done'), 500);
    return deferred.promise;
}

module.exports = qNotify;