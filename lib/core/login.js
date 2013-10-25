'use strict';

var log = require('logging').from('Jobvite.' + __filename);

var q = require('q'),
    qFail = require('../util/q-fail'),
    Hacks = require('../util/hacks'),
    Request = require('request'),
    USER_AGENT = require('../util/user-agent');

function getLogin(options) {
    var settings = {
        uri: 'https://hire.jobvite.com/Login/Login.aspx',
        headers: {
            'User-Agent': USER_AGENT,
            'set-cookie': []
        }
    };

    return q.nfcall(Request, settings).spread(function(res, body) {
        return login(options, res, body);
    });
}

function login(options, response, body) {
    var session_cookies = response.headers['set-cookie'];
    var viewstate = Hacks.getViewstate(body);
    var eventValidation = Hacks.getEventValidation(body);

    if (!viewstate) {
        log('Jobvite issue...', 'No viewstate...', Hacks.getTitle(body));
        return qFail('Jobvite issue...' + 'No viewstate...' + Hacks.getTitle(body))
    }

    if (!eventValidation) {
        log('Jobvite issue...', 'No eventValidation...', Hacks.getTitle(body));
        return qFail('Jobvite issue...' + 'No eventValidation...' + Hacks.getTitle(body))
    }


    var settings = {
        followRedirect: false,
        uri: 'https://hire.jobvite.com/Login/Login.aspx?ReturnUrl=%2fReports%2fCustomReport2.aspx%3fcr%3d' + options.report_id + '%3fl%3d1%3flogin%3d1',
        method: 'POST',
        body: 'PageData=' +
            '&__EVENTTARGET=LoginButton' +
            '&__EVENTARGUMENT=' +
            '&__VIEWSTATE=' + (viewstate ? encodeURIComponent(viewstate) : viewstate) +
            '&__EVENTVALIDATION=' + (eventValidation ? encodeURIComponent(eventValidation) : '') +
            '&platformName=0' +
            '&jvSocialId=0' +
            '&uname=0' +
            '&psw=0' +
            '&jvAuthenticationToken=0' +
            '&loginView=' +
            '&socialAccountEmail=' +
            '&UserName=' + encodeURIComponent(options.jobvite_username) +
            '&Password=' + encodeURIComponent(options.jobvite_password) +
            '&recaptcha_response_field=',
        headers: {
            'User-Agent': USER_AGENT,
            'Cookie': Hacks.encodeCookies(session_cookies),
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    return q.nfcall(Request.post, settings).spread(function(res, body) {
        return {
           res: res,
           body: body,
           session_cookies: session_cookies
       };
    });
}

module.exports = getLogin;