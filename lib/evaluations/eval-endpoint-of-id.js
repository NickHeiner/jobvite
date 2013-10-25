'use strict';

function evalEndpointOfId(id) {
    return 'https://source.jobvite.com/jhire/action/application/' + id + '/interviewEvaluations?readMode=1';
}

module.exports = evalEndpointOfId;