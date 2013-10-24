'use strict';

function getId(str) {
    str = str || '';
    var match = str.match(/\?[^=]*=([^"]*)"/);
    if (!match || match.length < 1) {
        debug && log(log, 'getId match error', str, match);
        return false;
    }
    return match[1];
}

module.exports = getId;