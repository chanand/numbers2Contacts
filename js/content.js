var ATTR_SAVE_NAME = 'data-replacedNumbers';

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (config) {

        var contacts = config.contacts;

        if (document.body.getAttribute(ATTR_SAVE_NAME)) {
            return;
        }

        var parent = 'datatable x-maxed',
            selector = 'tr td:nth-of-type(5)',
            elements = document.querySelectorAll(selector, parent);

        for (var i = 0; i < elements.length; i++) {
            var phoneNumberEl = elements[i],
                phoneNumber;

            if (phoneNumberEl.innerText) {

                phoneNumber = phoneNumberEl.innerText.replace(/[-\.]/g, '').replace('+972', '0')

                if (contacts[phoneNumber]) {
                    phoneNumberEl.innerHTML = '<abbr title="' + phoneNumberEl.innerText + '">' + contacts[phoneNumber] + '</abbr>';
                }
            }
        }

        document.body.setAttribute(ATTR_SAVE_NAME, true);
    });

    port.postMessage('getConfig');
});
