
const google = require('./utils/speech2text.js');
const say = require('./utils/tts.js').say;
const fs = require('fs');
const modules = require('./modules').modules;

function say_help(callback) {
    var rep = "I can: ";
    modules.forEach(function (module) {
        rep += module.help;
        if (i != modules.length) {
            rep += " and ";
        }
    });
    say(rep, callback);
}

function doSomething(str, callback) {
    if (modules.every(function (module) {
        if (str.match(/what can you do|help/i)) {
            console.log(`Module match: ${module.name}`);
            say_help(callback);
            return false;
        }
        if (str.match(module.reg))
            module.action(str, callback);
            return false;
    })) {
        callback();
    }
}

function runSpeech(micro, callback) {
    say("What can i do ?", function () {
            var outputFileStream = fs.WriteStream("./resources/output.raw");
            micro.recordFor(outputFileStream, 5000, function () {
                outputFileStream.end();
                google.speech2text("./resources/output.raw", function (err, res, body) {

                    if (err) {
                        console.error("error: ", err);
                        return say("I'm sorry, but it's seem you have an error.", callback);
                    }
                    else {
                        console.log(body);
                        const response = JSON.parse(body);
                        if (response && response.results) {
                          const sentence = response.results[0].alternatives[0].transcript;
                          say("You just say: " + sentence, function () {
                            doSomething(sentence, callback);
                          });
                        } else {
                          console.error("result empty");
                          return say("I'm sorry, I did n't heard you correctly.", callback);
                        }
                    }
                });
            });
    });
}

exports.mainRun = runSpeech;
