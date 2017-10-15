
const mic = require('mic');

var micInstance = mic({ 'rate': '16000', 'channels': '1', 'debug': true, 'exitOnSilence': 6 });
var micInputStream = micInstance.getAudioStream();

micInstance.start();
micInstance.pause();

function recordFor(stream, time, callback) {
    // Add new stream
    micInstance.pause();
    micInputStream.pipe(stream);

    function mResume() {
        console.log("throw timeout");
        /*
        setTimeout(function() {
                micInstance.pause();
        }, time);
        */
    }
    
    function mPause() {
        console.log("remove all");
        micInputStream.unpipe(stream);
        micInputStream.removeListener('silence', mSilence);
        micInputStream.removeListener('resumeComplete', mResume);
        micInputStream.removeListener('pauseComplete', mPause);
        callback();
    }

    function mSilence() {
        console.log("silence");
        micInstance.pause();
    }

    // resume with new stream
    micInputStream.on('silence', mSilence);
    micInputStream.on('resumeComplete', mResume);
    micInputStream.on('pauseComplete', mPause);
    micInstance.resume();
}

exports.instance = micInstance;
exports.stream = micInputStream;

exports.recordFor = recordFor;
