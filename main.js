const button = document.getElementById("getDetails");
const details = document.getElementById("details");


const device = await navigator.bluetooth.requestDevice({
    optionalServeces: ["battery_service", "device_information"],
    acceptAllDevices: true,
});
let device_name = device.gatt.device.name;
const server = await device.gatt.connect();
const batteryService = await server.getPrimaryService("battery_service");
const infoService = await server.getPrimaryService("device_information");

// Getting the current battery level
const batteryLevelCharacteristic = await batteryService.getCharacteristic(
    "battery_level"
  );
// Convert recieved buffer to number
const batteryLevel = await batteryLevelCharacteristic.readValue();
const batteryPercent = await batteryLevel.getUint8(0);
// Getting device information
// We will get all characteristics from device_information
const infoCharacteristics = await infoService.getCharacteristics();
console.log(infoCharacteristics);
let infoValues = [];
const promise = new Promise((resolve, reject) => {
  infoCharacteristics.forEach(async (characteristic, index, array) => {
    // Returns a buffer
    const value = await characteristic.readValue();
    console.log(new TextDecoder().decode(value));
    // Convert the buffer to string
    infoValues.push(new TextDecoder().decode(value));
    if (index === array.length - 1) resolve();
  });
});

promise.then(() => {
    // Display all the information on the screen
    // use innerHTML
    details.innerHTML = `
      Device Name - ${device_name}<br />
      Battery Level - ${batteryPercent}%<br />
      Device Information:
      <ul>
        ${infoValues.map((value) => `<li>${value}</li>`).join("")}
      </ul> 
    `;
  });

button.addEventListener("click", async () => {
    try {
    } catch(err){
        console.error();
        alert("Error");
    }
})