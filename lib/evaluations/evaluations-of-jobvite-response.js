'use strict';

var _ = require('lodash'),
    xml2js = require('xml2js'),
    q = require('q'),
    traverse = require('traverse'),
    ratingLabelOfNumber = require('./rating-label-of-number'),
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

    var interviews = _.map(interviewEvaluation.model.interviews, function (interview) {

        return q.nfcall(xml2js.parseString, interview.evaluation).then(function(parsedEval) {

            var ratingIndex = -1;
            traverse(parsedEval).forEach(function() {
                if (this.node.rating) {
                    ratingIndex = this.node.rating;
                }
            });

            if (ratingIndex !== -1) {
                return {
                    rating: {
                        index: ratingIndex,
                        label: ratingLabelOfNumber(ratingIndex)
                    },
                    interviewer: _.omit(interview.user, 'EId')
                };
            }
        });

    });

    return q.all(interviews).then(_.compact);
}

module.exports = evaluationsOfJobviteResponse;