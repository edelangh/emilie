
const hotword = require('./srcs/utils/hotwordDetector.js')
const a = require('./srcs/utils/speech2text.js');
const mic = require('./srcs/utils/micro.js');
const say = require('./srcs/utils/tts.js').say;
const fs = require('fs');

function doSomething(str, callback) {
    const list = [
        {reg: /weather/gi, action: function () {say("Use an IA as meteorologist is a crime !", callback)}},
        {reg: /what/gi, action: function () {say("Do you know Google ? So use it dude !", callback)}}
    ];

    for (var i in list) {
        event = list[i];
        console.log(event);
        if (str.match(event.reg))
            return event.action();
    }
    callback();
}

function runSpeech(microRENAME, callback) {
    say("What can i do ?", function () {
            var outputFileStream = fs.WriteStream("./resources/output.raw");
            microRENAME.recordFor(outputFileStream, 5000, function () {
                outputFileStream.end();
                a.speech2text("./resources/output.raw", function (err, res, body) {

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

const detector = hotword.generate(function () {
    // Remove temporaly hotword detector
    mic.instance.pause();
    mic.stream.unpipe(detector);

    runSpeech(mic, function () {
        runHotword();
    });
});

function runHotword() {
    console.log("[====================]");

    mic.stream.pipe(detector);

    mic.instance.resume();
}

runHotword();

function exitHandler(options, err) {
  console.log("EXITING");
  mic.instance.stop();

  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
