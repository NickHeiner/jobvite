'use strict';

var hacks = require('../util/hacks'),
    request = require('request'),
    evalEndpointOfId = require('./eval-endpoint-of-id'),
    evaluationsOfJobviteResponse = require('./evaluations-of-jobvite-response'),
    USER_AGENT = require('../util/user-agent'),
    login = require('../core/login'),
    q = require('q'),
    _ = require('lodash'),
    cheerio = require('cheerio');

function evaluations(jobviteUsername, jobvitePassword, ids) {

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

                var cookies = result.res.headers['set-cookie'];
                var settings = {
                    followRedirect: false,
                    uri: evalEndpointOfId(id),
                    method: 'GET',
                    headers: {
                        'User-Agent': USER_AGENT,
                        'Content-Type': 'application/x-www-form-urlencoded',
                        'Cookie': hacks.encodeCookies(result.session_cookies, cookies)
                    }
                };

                return q.nfcall(request, settings).spread(function (response, body) {
                    var evaluation = JSON.parse(body);

                    // TODO why is this try-catch necessary?
                    try {
                        return evaluationsOfJobviteResponse(evaluation);
                    } catch (e) {
                        console.log(e);
                    }
                }).then(function(result) {
//                        console.log('result', result);
                    });
            })).then(function(allRes) {
//                    console.log('allRes', allRes.length);
                });
        });

    } catch (e) {
        console.log(e);
    }
}

module.exports = evaluations;