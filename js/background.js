var contacts = {},
    pages = {
        'www.golantelecom.co.il/web/account_billing_calls.php': {
            parent: 'datatable x-maxed',
            selector: 'tr td:nth-of-type(5)'
        }
    };

var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key': 'anonymous',
    'consumer_secret': 'anonymous',
    'scope': 'https://www.google.com/m8/feeds/',
    'app_name': 'Golan Calls'
});

var callback = function (resp) {
    var response = JSON.parse(resp),
        feed = response.feed;

    feed.entry.forEach(function (ele) {
        if (ele.gd$phoneNumber && ele.gd$phoneNumber.length) {
            ele.gd$phoneNumber.forEach(function (phone) {
                var number = phone.$t.replace(/[-\.]/g, '').replace('+972', '0');
                contacts[number] = ele.title.$t;
            });
        }
    });

};

var onAuthorized = function () {
    var url = 'https://www.google.com/m8/feeds/contacts/default/full';
    var request = {
        'method': 'GET',
        'parameters': {
            'alt': 'json',
            'max-results': 25000
        }
    };

    oauth.sendSignedRequest(url, callback, request);
};

var queryTab = function () {
    chrome.tabs.query({active: true, windowId: chrome.windows.WINDOW_ID_CURRENT}, checkTabUrl);
};

var checkTabUrl = function (tabs) {
    var tab = tabs[0],
        reg = /^.*:\/\/(.*)\?/g,
        url = reg.exec(tab.url);

    url = url && url.length && (url = url[1]);

    if (url && pages[url]) {
        var port = chrome.tabs.connect(tab.id);

        port.onMessage.addListener(function () {
            port.postMessage({
                contacts: contacts,
                settings: pages[url]
            });
        });
    }

};

oauth.authorize(onAuthorized);

chrome.tabs.onUpdated.addListener(function () {
    queryTab();
});

queryTab();


