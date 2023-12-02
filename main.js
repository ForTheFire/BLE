function requestDevice() {
    let options = {
        acceptAllDevices: true
    };

    navigator.bluetooth.requestDevice(options)
        .then(device => {
            let devicesList = document.getElementById('devices-list');
            let listItem = document.createElement('li');
            listItem.textContent = device.name;
            devicesList.appendChild(listItem);
        })
        .catch(error => {
            console.error(`Device request failed: ${error}`);
        });
}

document.getElementById('available-devices').addEventListener('click', requestDevice);