
const lame = require('lame');
const Speaker = require('speaker');
const gtts = require('node-gtts')('en');

exports.say = function (text, callback) {
    var reader = new lame.Decoder();

    reader.on('format', function (format) {
        reader.pipe(new Speaker(format));
    });
    
    reader.on('end', function () {
        if (callback) {
                setTimeout(function () {
                    callback();
                }, 700);
        }
    });
    gtts.stream(text).pipe(reader);
}
