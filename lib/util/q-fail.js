'use strict';

var q = require('q');

function qFail(err) {
    var deferred = q.defer();
    deferred.reject(err);
    return deferred.promise;
}

module.exports = qFail;