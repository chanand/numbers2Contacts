chrome.extension.onConnect.addListener(function(port) {
    port.onMessage.addListener(function(phones) {

        var table = document.getElementsByClassName('datatable x-maxed').item(),
            rows = table.getElementsByTagName('tr');

        for (var i = 2; i < rows.length; i++) {
            var row = rows[i];

            var phoneNumberEl = row.getElementsByTagName('td')[4],
                phoneNumber = phoneNumberEl.innerText.replace(/[-\.]/g, '').replace('+972', '0');

            if (phoneNumberEl.innerText) {

                if (phones[phoneNumber]) {
                    phoneNumberEl.innerText = phones[phoneNumber];
                }
            }

        }


    });

});
