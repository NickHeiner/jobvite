var log = require('logging').from(__filename),
    extend = require('../util/extend'),
    Request = require('./request');

var options = {};

function config(options_) {
    extend(options, options_);
    return this;
}

function load(){
//
//    var q = require('q');
//    var d = q.defer();
//
//    Request.config(options).getData().then(d.resolve, d.reject, d.notify);
//
//    return d.promise;
//
    return Request.config(options).getData();
}

module.exports.config = config;
module.exports.load = load;