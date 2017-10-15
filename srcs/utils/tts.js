
const lame = require('lame');
const Speaker = require('speaker');
const gtts = require('node-gtts')('en');

exports.say = function (text) {
    var reader = new lame.Decoder();

    reader.on('format', function (format) {
        reader.pipe(new Speaker(format));
    });
    gtts.stream(text).pipe(reader);
}
