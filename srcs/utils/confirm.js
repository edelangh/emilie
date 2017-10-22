
const fs = require('fs');
const say = require('./tts').say;
const google = require('./speech2text.js');
const mic = require('./micro.js');

const yes = /yes|oui|yep|go/i;

function confirm(text, onYes, onNo)
{
    say(text, function () {
        var outputFileStream = fs.WriteStream("./resources/output.raw");
        mic.recordFor(outputFileStream, 5000, function () {
          outputFileStream.end();
          google.speech2text("./resources/output.raw", function (err, _, body) {
            console.log(`confirm s2t: ${body}`);
            if (!err && body.match(yes)) {
                onYes();
            } else {
                onNo();
            }
          });
        });
    });
}

exports.confirm = confirm;
