var tessel = require('tessel');
var camera = require('camera-vc0706').use(tessel.port.A);
var led    = tessel.led[0];

camera.on('ready', function() {
    led.high();
    camera.takePicture(function(err, image) {
        if (err) throw err;
        led.low();
        process.sendfile('image.jpg', image);
        camera.disable();
    });
});

