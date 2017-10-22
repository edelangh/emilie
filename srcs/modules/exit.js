
const say = require('../utils/tts.js').say;

function action(str, callback) {
  say(`I will be back !`, function () {
      process.exit(0);
  });
}

exports.module = {
    name: 'shutdown',
    help: 'shutdown me',
    reg: /shut up|shut down|exit/i,
    action: action
};
