
const hotword = require('./srcs/utils/hotwordDetector.js')
const a = require('./srcs/utils/speech2text.js');
const mic = require('./srcs/utils/micro.js')

const fs = require('fs');

function runSpeech(microRENAME, callback) {
    var outputFileStream = fs.WriteStream("./resources/output.raw");
    microRENAME.recordFor(outputFileStream, 5000, function () {
        outputFileStream.end();
        a.speech2text("./resources/output.raw", function (err, res, body) {

            if (err) 
                return console.error("error: ", err)
            else {
                console.log(body);
                const response = JSON.parse(body);
                if (response && response.results) {
                  const sentence = response.results[0].alternatives.transcript;
                  console.log(sentence);
                } else {
                  console.error("result empty");
                }
            }
        });
        callback();
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
