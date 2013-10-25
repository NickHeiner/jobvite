'use strict';

var summaryUrlOfId = require('./summary-url-of-id'),
    hacks = require('../util/hacks'),
    request = require('request'),
    USER_AGENT = require('../util/user-agent'),
    evaluationHrefOfSummaryHref = require('./evaluation-href-of-summary-href'),
    login = require('../core/login'),
    q = require('q'),
    _ = require('lodash'),
    cheerio = require('cheerio');

function summary(jobviteUsername, jobvitePassword, ids) {

    if (!jobviteUsername) {
        console.log('summary: jobviteUsername is required');
    }

    if (!jobvitePassword) {
        console.log('summary: jobvitePassword is required');
    }

    try {
        return login({
            jobvite_username: jobviteUsername,
            jobvite_password: jobvitePassword
        }).then(function (result) {

            console.log('authenticated');

            return q.all(_.map(ids, function (id) {

                console.log('Requesting summmary for', id);

                var url = summaryUrlOfId(id);

                var cookies = result.res.headers['set-cookie'];
                var settings = {
                    followRedirect: false,
                    uri: 'https://source.jobvite.com/jhire/action/application/' + id + '/interviewEvaluations?readMode=1',
                    method: 'GET',
                    headers: {
                        'User-Agent': USER_AGENT,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': hacks.encodeCookies(result.session_cookies, cookies)
                    }
                };

                console.log('requesting', url);

                return q.nfcall(request, settings).spread(function (response, body) {

                    console.log(JSON.parse(body));

//                    if (response.statusCode !== 302) {
//                        throw new Error('expecting a redirect, but got ' + response.statusCode + ' for ' + response.req.href)
//                    }
//
////                    console.log(response.headers);
//
//                    // ;" href="#/evaluations/{{params.applicationId}}">Evaluations</
//                    // https://hire.jobvite.com/jhire/modules/candidates/details.html?applicationId=pOcQkgwV&ticket=3296C1CBE412AC159937A64E1FE648DE62A9F8D138BD71ECFEF89AD7F921A95A#/evaluations
//                    var summaryHref = response.headers.location;
//                    console.log(evaluationHrefOfSummaryHref(summaryHref));
//
//                    // https://source.jobvite.com/jhire/modules/candidates/details.html?applicationId=pGorhgwx&ticket=E0BF2DD27BEFF3F67EEF925023F9FE9E0C16246B326B2DFCC302659F70FB6D4F#/evaluations/pGorhgwx
//                    // https://source.jobvite.com/jhire/modules/candidates/details.html?applicationId=pGorhgwx&ticket=E0BF2DD27BEFF3F67EEF925023F9FE9E0C16246B326B2DFCC302659F70FB6D4F#/evaluations/pGorhgwx
                });
            }));
        });

    } catch (e) {
        console.log(e);
    }
}

module.exports = summary;