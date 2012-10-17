var phones = {};

var oauth = ChromeExOAuth.initBackgroundPage({
    'request_url': 'https://www.google.com/accounts/OAuthGetRequestToken',
    'authorize_url': 'https://www.google.com/accounts/OAuthAuthorizeToken',
    'access_url': 'https://www.google.com/accounts/OAuthGetAccessToken',
    'consumer_key': 'anonymous',
    'consumer_secret': 'anonymous',
    'scope': 'https://www.google.com/m8/feeds/',
    'app_name': 'Golan Calls'
});

function callback(resp, xhr) {
    var response = JSON.parse(resp),
        feed = response.feed;

    feed.entry.forEach(function (ele, index) {
        if (ele.gd$phoneNumber && ele.gd$phoneNumber.length) {
            ele.gd$phoneNumber.forEach(function (phone) {
                var number = phone.$t.replace(/[-\.]/g, '').replace('+972', '0');
                phones[number] = ele.title.$t;
            });
        }
    });

}


function onAuthorized() {
    var url = 'https://www.google.com/m8/feeds/contacts/default/full';
    var request = {
        'method': 'GET',
        'parameters': {
            'alt': 'json',
            'max-results': 25000
        }
    };

    oauth.sendSignedRequest(url, callback, request);
}


chrome.browserAction.onClicked.addListener(function (tab) {

    var port = chrome.tabs.connect(tab.id);
    port.onMessage.addListener(function () {
        port.postMessage(phones);
    });

});

oauth.authorize(onAuthorized);
