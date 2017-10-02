
const detector = require('./srcs/utils/hotwordDetector.js').generate();
const micro = require('./srcs/utils/micro.js')
const microStream = micro.start();

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
