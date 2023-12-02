let deviceServer;

function scanForDevices() {
    let serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    let deviceSelect = document.getElementById('device-select');

    deviceSelect.innerHTML = '<option value="">Searching for devices...</option>';

    bluetoothDevice = navigator.bluetooth.requestDevice({
        filters: [{
            services: [serviceUUID]
        }]
    })
    .then(device => {
        let option = document.createElement('option');
        option.value = device.id;
        option.text = device.name;
        deviceSelect.add(option);
        if (bluetoothDevice.gatt.connected) {
            bluetoothDevice.gatt.disconnect();
        }
    })
    .catch(error => {
        console.error(`Failed to request device: ${error}`);
    });
}
async function connectToDevice() {
    let serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    let deviceSelect = document.getElementById('device-select');
    let selectedDeviceId = deviceSelect.options[deviceSelect.selectedIndex].value;

    if (!selectedDeviceId) {
        console.error('No device selected');
        return;
    }

    deviceServer = await navigator.bluetooth.requestDevice({
        filters: [{
            services: [serviceUUID]
        }],
        optionalServices: [serviceUUID]
    })
    return device.gatt.connect();
}
async function sendMessage() {
    let serviceUUID = '0000ffe0-0000-1000-8000-00805f9b34fb';
    let characteristicUUID = '0000ffe1-0000-1000-8000-00805f9b34fb';

    if (!deviceServer) {
        await connectToDevice();
    }

    if (!deviceServer) {
        console.error('Failed to connect to device');
        return;
    }

    try {
        let server = await deviceServer.gatt.connect();
        let service = await server.getPrimaryService(serviceUUID);
        let characteristic = await service.getCharacteristic(characteristicUUID);

        let encoder = new TextEncoder('utf-8');
        let message = encoder.encode('Hello, Arduino!');
        await characteristic.writeValue(message);

        console.log('Message sent successfully');
    } catch (error) {
        console.error(`Failed to send message: ${error}`);
    }
}

//document.getElementById('scan-button').addEventListener('click', scanForDevices);
document.getElementById('send-button').addEventListener('click', sendMessage);
document.getElementById("connect-button").addEventListener('click', connectToDevice)