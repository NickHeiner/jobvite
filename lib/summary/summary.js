'use strict';

var summaryUrlOfId = require('./summary-url-of-id'),
    hacks = require('../util/hacks'),
    request = require('request'),
    USER_AGENT = require('../util/user-agent'),
    login = require('../core/login'),
    q = require('q');

function summary(id, jobviteUsername, jobvitePassword) {

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
        }).then(function(result) {
            var url = summaryUrlOfId(id);

            var cookies = result.res.headers['set-cookie'];
            var settings = {
                followRedirect: false,
                uri: url,
                method: 'GET',
//        body: 'PageData=' +
//            '&__VIEWSTATE=' + encodeURIComponent(viewstate) +
//            '&__EVENTTARGET=btnRefresh' +
//            '&__EVENTARGUMENT=' + encodeURIComponent('<Filters><NormalFilters></NormalFilters><DateRangeFilters></DateRangeFilters></Filters>') +
//            '&pageState=0' +
//            '&hdnShouldEmail=' +
//            '&hdnFilterCount=' +
//            '&AddDateToTitle=' +
//            '&ReportDescription=' + encodeURIComponent('Using this for data scraping.') +
//            '&ReportCategory=8192' +
//            '&IsPrivateReport=checked' +
//            '&IncludeAuthorInfoInExcel=' +
//            '&ShowFiltersInExcel=',
                headers: {
//            'Referer': 'https://report.jobvite.com/Reports/CustomReport2.aspx?cr=6jI9VfwP',
                    'User-Agent': USER_AGENT,
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Cookie': hacks.encodeCookies(result.session_cookies, cookies)
                }
            };

            return q.nfcall(request, settings).spread(function (response, body) {
                console.log('body', body);
            });
        });

    } catch (e) {
        console.log(e);
    }
}

module.exports = summary;