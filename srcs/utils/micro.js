
const mic = require('mic');

var micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': false });
var micInputStream = micInstance.getAudioStream();

function start() {
    micInstance.start();
    return micInputStream;
}

function stop() {
    micInstance.stop();
}

exports.start = start;
exports.stop = stop;
