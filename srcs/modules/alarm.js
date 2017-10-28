
const say = require('../utils/tts.js').say;
const confirm = require('../utils/confirm.js').confirm;
const request = require('request');

// Define an alarm in 5 minutes
// Define an alarm at 8
// set an alarm at 8
var g_alarms = [];

function convert_time(def, v1, multi, v2) {
    const s = multi.match(/(second(?:s)?)/i);
    const m = multi.match(/(minute(?:s)?)/i);
    const h = multi.match(/(hour(?:s)?|o'clock)/i);
    const d = multi.match(/(day(:?s)?)/i);

    const mult =
    (s ? 1 :
    (m ? 60 :
    (h ? 60*60 :
    (d ? 60*60*24 :
    (def)))));

    console.log(v1 + " * " + mult + " * " + v2 * 60);
    var time = parseInt(v1) * mult;
    if (v2) {
        time += parseInt(v2);
    }
    return time;
}

function action_add(str, callback) {
    const m = str.match(/(?:Add|Define|set)(?:.*) alarm (for|in|at) (\d+)(.*)(\d*)?/i);

    if (m) {
        var time = convert_time((m[1] != "in" ? 3600 : 60), m[2], m[3], m[4]);
        console.log(`time: ${time}`);

        if (m[1] == "in") {
        } else {
            const day = 60*60*24;
            const now = (new Date().getTime()/1000 % day)|0;
            console.log(`now: ${now}`);
            if (now > time) {
                time += (day - now);
            } else {
                time -= now;
            }
        }
        say(`Okey, I set an alarm in ${time} seconds`, function () {
          var alarm = setTimeout(function () {say("ALARM ALARM ALARM", undefined)}, time*1000);
          g_alarms.push(alarm);
          return callback();
        });
    }
    return false;
}

function action_cancel(str, callback)
{
    const m = str.match(/(cancel|remove)/i);

    if (m) {
        say(`I will cancel all alarms`, function () {
            g_alarms.map((e) => clearTimeout(e));
            g_alarms = [];
        });
        return callback();
    }
    return false;
}

function action(str, callback) {
    action_add(str, callback) !== false
    || action_cancel(str, callback) !== false
    || callback();
}

exports.module = {
    name: 'alarm',
    help: 'Define alarms to wake up you',
    reg: /alarm/i,
    action: action
};
