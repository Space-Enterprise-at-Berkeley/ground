const HID = require('node-hid');

function getDevices() {
HID.devices().forEach((device) => {
  console.log(`Device path: ${device.path}`);
  console.log(`  Vendor ID: ${device.vendorId}`);
  console.log(`  Product ID: ${device.productId}`);
  console.log(`  Manufacturer: ${device.manufacturer}`);
  console.log(`  Product: ${device.product}`);
});
}

const vendorId = 1133; // Replace with your Logitech controller's VID
const productId = 49686; // Replace with your Logitech controller's PID

const device = new HID.HID(vendorId, productId);

device.on('data', (data) => {
  console.log(`Data received: ${data[0]-127} ${data[1]-127}`);
  // Parse and process the data according to your controller's HID report format
});

device.on('error', (error) => {
  console.log(`Error: ${error}`);
});

