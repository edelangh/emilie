
const hotword = require('./srcs/utils/hotwordDetector.js')
const mic = require('./srcs/utils/micro.js');
const mainRun = require('./srcs/main.js').mainRun;

const detector = hotword.generate(function () {
    // Remove temporaly hotword detector
    mic.instance.pause();
    mic.stream.unpipe(detector);

    // Restart
    mainRun(mic, runHotword);
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
