
const say = require('../utils/tts.js').say;

function action_add(str, callback) {
    const m =    str.match(/Add (.*) (?:to|in)(?: my)? shopping(?: list)?.+/i)
              || str.match(/Add (?:to|in)(?: my)? shopping(?: list)? (.*)/i);

    var item = undefined
    if (m) {item = m[1];}

    if (item) {
        return say(`I will add ${item} to shopping list`, function () {
            callback();
        });
    }
    return false;
}

function action_list(str, callback) {
    return say(`You have nothing in your shopping list.`, callback);
}

function action(str, callback) {
    action_add(str, callback) !== false
    || action_list(str, callback);
}

exports.module = {
    name: 'shopping',
    help: 'Make your shopping list.',
    reg: /shopping/i,
    action: action
};
