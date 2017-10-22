
const lame = require('lame');
const Speaker = require('speaker');
const gtts = require('node-gtts')('en');

exports.say = function (text, callback) {
    var reader = new lame.Decoder();

    console.log(`say: ${text}`);
    reader.on('format', function (format) {
        reader.pipe(new Speaker(format));
    });
    
    reader.on('end', function () {
        if (callback) {
                setTimeout(function () {
                    callback();
                }, 600);
        }
    });
    gtts.stream(text).pipe(reader);
}
