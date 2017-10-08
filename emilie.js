
const hotword = require('./srcs/utils/hotwordDetector.js')
const a = require('./srcs/utils/speech2text.js');
const micro = require('./srcs/utils/micro.js')
const microStream = micro.start();

/*
hotword =>
   record
      => trad
      => trad
      => trad
      => trad
      */
const fs = require('fs');

function runSpeech() {
    var outputFileStream = fs.WriteStream("./resources/output.raw");
    micro.recordFor(outputFileStream, 5000);
    a.speech2text("./resources/output.raw", function (err, res, body) {
            outputFileStream.end();
            
            if (err) 
                return console.log(err)
            console.log(body);
            const coucou = JSON.parse(body);

            const sentence = coucou.results[0].alternatives.transcript;
            console.log(sentence);
    });
}

const detector = hotword.generate(function () {
    micro.instance.pause();
    runSpeech();
    micro.instance.resume();
});

microStream.pipe(detector);

function exitHandler(options, err) {
  console.log("EXITING");
  micro.stop();

  if (options.cleanup) console.log('clean');
  if (err) console.log(err.stack);
  if (options.exit) process.exit();
}

process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));
