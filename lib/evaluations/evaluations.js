'use strict';

var hacks = require('../util/hacks'),
    request = require('request'),
    evalEndpointOfId = require('./eval-endpoint-of-id'),
    evaluationsOfJobviteResponse = require('./evaluations-of-jobvite-response'),
    chalk = require('chalk'),
    idColor = chalk.cyan,
    miscColor = chalk.magenta,
    USER_AGENT = require('../util/user-agent'),
    login = require('../core/login'),
    q = require('q'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    mkdirp = require('mkdirp');

function cacheFileNameOfId(id) {
    return path.join(__dirname, '..', '..', 'cache', 'evaluations', id + '.json');
}

function isCached(id) {
    return fs.existsSync(cacheFileNameOfId(id));
}

var postProcess = _.flatten;

function evaluations(jobviteUsername, jobvitePassword, ids) {

    try {

        var cachedIds = _.filter(ids, isCached),
            nonCachedIds = _.reject(ids, isCached),
            responsesForCachedIds = _(cachedIds)
                .map(cacheFileNameOfId)
                .map(function(filePath) {
                    return path.resolve(filePath);
                })
                .map(require)
                .value();

        console.log('Found', miscColor(cachedIds.length), 'cached responses, leaving', miscColor(nonCachedIds.length),
            'to request');

        if (cachedIds.length === ids.length) {
            return q(postProcess(responsesForCachedIds));
        }

        if (!jobviteUsername) {
            console.log('summary: jobviteUsername is required');
        }

        if (!jobvitePassword) {
            console.log('summary: jobvitePassword is required');
        }

        return login({
            jobvite_username: jobviteUsername,
            jobvite_password: jobvitePassword
        }).then(function (result) {

                console.log('authenticated');

                return q.all(_.map(nonCachedIds, function (id) {

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
                            if (response.statusCode !== 200) {
                                console.log('Skipping id: ' + idColor(id) + ' because http response was ' +
                                    response.statusCode);
                                return;
                            }

                            // TODO why is this try-catch necessary?
                            try {

                                var xmlEvaluation = JSON.parse(body);

                                return evaluationsOfJobviteResponse(xmlEvaluation).then(function (evaluations) {

                                    if (!evaluations.length) {
                                        console.log('No evaluations found for', idColor(id),
                                            'because the review was not of a supported form.');
                                    }

                                    return _.map(evaluations, function(evaluation) {
                                        return _.merge(evaluation, {candidate: id});
                                    });
                                });

                            } catch (e) {
                                console.log(e, body);
                            }
                        }).then(function(responseForId) {

                                var toCache = responseForId || [],
                                    cacheFilePath = cacheFileNameOfId(id);
                                mkdirp(path.dirname(cacheFilePath));
                                console.log('Caching response for', idColor(id), 'at', miscColor(cacheFilePath));
                                fs.writeFileSync(cacheFilePath, JSON.stringify(toCache, null, 2));

                                return toCache;
                            });
                    }))
                    .then(function(evaluations) {
                        return [].concat(evaluations).concat(responsesForCachedIds);
                    })
                    .then(postProcess);
            });

    } catch (e) {
        console.log(e);
    }
}

module.exports = evaluations;