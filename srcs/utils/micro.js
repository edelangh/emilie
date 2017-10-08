
const mic = require('mic');

var micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': false });
var micInputStream = micInstance.getAudioStream();

function instance() {
    return micInstance;
}

function start() {
    micInstance.start();
    return micInputStream;
}

function stop() {
    micInstance.stop();
}

function recordFor(pipe, time, callback) {
    var micI = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': false });
    var micIStream = micI.getAudioStream();

        micIStream.on('startComplete', function() {
            setTimeout(function() {
                    micI.stop();
            }, time);
        });

        micIStream.on('stopComplete', function() {
            callback();
        });

        micI.start();
}

exports.recordFor = recordFor;
exports.instance = micInstance;
exports.start = start;
exports.stop = stop;
