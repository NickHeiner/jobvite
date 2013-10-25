'use strict';

var _ = require('lodash');

function evaluationsOfJobviteResponse(jobviteResponse) {
    var interviewEvaluation = _.find(jobviteResponse.evaluationInfo, function(evaluation) {
        // TODO can we use the cool lodash syntax here?
        return evaluation.workflowElementInfo.elementName === 'interview';
    }),
        individualFeedback = _.map(interviewEvaluation.model.interviews, 'evaluation');

    console.log(individualFeedback);

}

module.exports = evaluationsOfJobviteResponse;