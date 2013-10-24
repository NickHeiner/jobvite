'use strict';

var q = require('q');

function qNotify(val) {
    var deferred = q.defer();
    deferred.notify(val);
    deferred.resolve();
    return deferred.promise;
}

module.exports = qNotify;