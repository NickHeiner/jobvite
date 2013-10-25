'use strict';

var _ = require('lodash'),
    xml2js = require('xml2js'),
    q = require('q'),
    traverse = require('traverse'),
    chalk = require('chalk'),
    ratingLabelOfNumber = require('./rating-label-of-number'),
    util = require('util'),
    interviewKey = 'Interview',

    /**
     * Sales seems to use a different template for reviewing people.
     * Instead of a int, they have an entire questionnaire addressing
     * different points. Let's just skip those cases for now.
     */
        verbotenEmail = 'jobvite-presentation@opower.com';

function workflowNameOfEvaluation(evaluation) {
    return evaluation.workflowElementInfo.elementName;
}

/**
 * Sometimes ratingIndex will look like:
 *   { '$':
 *      { title: 'Appropriate for position?',
 *        candelete: 'False',
 *        rating: 'No' },
 *     choice: [ [Object], [Object], [Object] ] },
 *
 * In those cases, fuck it.
 */
function isSupportedReviewTemplate(ratingIndex, interview) {
    return !(ratingIndex === -1 || interview.user.email === verbotenEmail || _.isNaN(parseInt(ratingIndex)));
}

function evaluationsOfJobviteResponse(jobviteResponse) {

    var interviewEvaluation = _.find(jobviteResponse.evaluationInfo, function (evaluation) {
        return workflowNameOfEvaluation(evaluation) === interviewKey;
    });

    if (!interviewEvaluation) {
        throw new Error('Could not find "' + interviewKey + '" in evaluation response, which did include: ' +
            _.map(jobviteResponse.evaluationInfo, workflowNameOfEvaluation));
    }

    var interviews = _.map(interviewEvaluation.model.interviews, function (interview) {

        return q.nfcall(xml2js.parseString, interview.evaluation).then(function (parsedEval) {
            try {

                var ratingIndex = -1;
                traverse(parsedEval).forEach(function () {
                    if (this.node.rating) {
                        if (ratingIndex !== -1) {
                            throw new Error('ratingIndex should not be set twice, but was for node: ' + this.node);
                        }

                        ratingIndex = this.node.rating;
                    }
                });

                if (isSupportedReviewTemplate(ratingIndex, interview)) {
                    return {
                        rating: {
                            index: ratingIndex,
                            label: ratingLabelOfNumber(ratingIndex)
                        },
                        interviewer: _.omit(interview.user, 'EId')
                    };
                }
            } catch (e) {
                console.log(e);
            }
        });

    });

    // Is _.compact hiding a bug?
    return q.all(interviews).then(_.compact);
}

module.exports = evaluationsOfJobviteResponse;