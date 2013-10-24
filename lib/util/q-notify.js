'use strict';

var q = require('q');

function qNotify(val) {
    var deferred = q.defer();
    deferred.notify(val);
    return deferred.promise;
}

module.exports = qNotify;