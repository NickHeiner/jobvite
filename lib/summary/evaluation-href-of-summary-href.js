'use strict';

function evaluationHrefOfSummaryHref(summaryHref) {
    return summaryHref.replace(/summary/, 'evaluations');
}

module.exports = evaluationHrefOfSummaryHref;