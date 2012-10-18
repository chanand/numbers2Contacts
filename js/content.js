var ATTR_SAVE_NAME = 'data-replacedNumbers';

chrome.extension.onConnect.addListener(function (port) {
    port.onMessage.addListener(function (phones) {

        var table = document.getElementsByClassName('datatable x-maxed').item(),
            rows = table.getElementsByTagName('tr');

        if (table.getAttribute(ATTR_SAVE_NAME)) {
            return;
        }

        for (var i = 2; i < rows.length; i++) {
            var row = rows[i];

            var phoneNumberEl = row.getElementsByTagName('td')[4],
                phoneNumber;

            if (phoneNumberEl.innerText) {

                phoneNumber = phoneNumberEl.innerText.replace(/[-\.]/g, '').replace('+972', '0')

                if (phones[phoneNumber]) {
                    phoneNumberEl.innerHTML = '<abbr title="' + phoneNumberEl.innerText + '">' + phones[phoneNumber] + '</abbr>';
                }
            }

        }

        table.setAttribute(ATTR_SAVE_NAME, true);
    });

    port.postMessage('phones');

});
