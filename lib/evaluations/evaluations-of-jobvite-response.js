'use strict';

var _ = require('lodash'),
    interviewKey = 'Interview';

function workflowNameOfEvaluation(evaluation) {
    return evaluation.workflowElementInfo.elementName;
}

function evaluationsOfJobviteResponse(jobviteResponse) {

    var interviewEvaluation = _.find(jobviteResponse.evaluationInfo, function (evaluation) {
        // TODO can we use the cool lodash syntax here?
        return workflowNameOfEvaluation(evaluation) === interviewKey;
    });

    if (!interviewEvaluation) {
        throw new Error('Could not find "' + interviewKey + '" in evaluation response, which did include: ' +
            _.map(jobviteResponse.evaluationInfo, workflowNameOfEvaluation));
    }

    return _.map(interviewEvaluation.model.interviews, function(interview) {
        return {
            evaluation: interview.evaluation,
            interviewer: _.omit(interview.user, 'EId')
        };
    });
}

module.exports = evaluationsOfJobviteResponse;