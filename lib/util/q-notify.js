'use strict';

var q = require('q'),
    _ = require('lodash');

function qNotify(val) {
    var deferred = q.defer();
//    deferred.notify(val);
//    deferred.resolve('notify done');
    setTimeout(_.partial(deferred.notify, val), 200);
    setTimeout(_.partial(deferred.resolve, 'notify done from ' + val), 500);
    return deferred.promise;
}

module.exports = qNotify;