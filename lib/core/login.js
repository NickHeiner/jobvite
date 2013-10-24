'use strict';

var log = require('logging').from('Jobvite.' + __filename);

var q = require('q'),
    Hacks = require('../util/hacks'),
    Request = require('request');

function getLogin(USER_AGENT) {

    var settings = {
        uri: 'https://hire.jobvite.com/Login/Login.aspx',
        headers: {
            'User-Agent': USER_AGENT,
            'set-cookie': []
        }
    };

    return q.nfcall(Request, settings).spread(function(res, body) {
        return login(USER_AGENT, res, body);
    });

//    Request(settings, function(err, response, body) {
//        login(err, response, body, callback);
//    });
}

function login(USER_AGENT, response, body) {
    var session_cookies = response.headers['set-cookie'];
    var viewstate = Hacks.getViewstate(body);
    var eventValidation = Hacks.getEventValidation(body);


    if (!viewstate) {
        log('Jobvite issue...', 'No viewstate...', Hacks.getTitle(body));
//        callback(false);
    }

    if (!eventValidation) {
        log('Jobvite issue...', 'No eventValidation...', Hacks.getTitle(body));
        //callback(false);
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

    return q.nfcall(Request.post, settings).then(function(res, body) {
       return {
           res: res,
           body: body,
           session_cookies: session_cookies
       };
    });

    //log('get login');
//log('get login', settings);
//    Request.post(settings, function(err, response, body) {
//        //log('---------------------------');
//        //log('title', Hacks.getTitle(body));
//        getReport(err, response, body, callback)
//    });
//    return true;
}

module.exports = getLogin;