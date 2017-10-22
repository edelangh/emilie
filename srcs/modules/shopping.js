
const say = require('../utils/tts.js').say;
const confirm = require('../utils/confirm.js').confirm;
const request = require('request');

///
/// Actions
///

const dashboard_url = 'http://dashboard.seed-up.org';
const shopping_api = '/api/shoppingList';

const get_options = {
    uri : `${dashboard_url}${shopping_api}`,
    method : 'GET',
    headers : {
        'Content-Type': 'application/json;charset=UTF-8',
    }
};

function dashboard_shopping_get(callback) {
    request(get_options, function (err, _, body) {
        console.log(body);
        if (err) return callback(undefined);
        else return callback(JSON.parse(body));
    });
}

// Use ... operator to pass post_options in const var
var post_options = {
    uri : `${dashboard_url}${shopping_api}`,
    method : 'POST',
    headers : {
        'Content-Type': 'application/json;charset=UTF-8',
    }
};

function dashboard_shopping_post(name, volume, callback) {
    post_options.body = JSON.stringify({name, volume});
    request(post_options, function (err, _, body) {
        callback();
    });
}

///
/// Trigger
///

function action_add(str, callback) {
    const m =    str.match(/(?:Add|push|write) (.*) (?:to|in)(?: my)? shopping(?: list)?.+/i)
              || str.match(/(?:Add|push|write) (?:to|in)(?: my)? shopping(?: list)? (.*)/i);

    var item = undefined;
    if (m) {item = m[1];}

    if (item) {
        return confirm(`Do you want add ${item} to shopping list`, function () {
            const m = item.match(/(some|an|\d*(?: )?(?:kg|kilograms|kilo|g|l|litre|litres)?) (.*)/i);
            
            var name = item;
            var volume = "some";
            if (m) {
                name = m[2];
                volume = m[1];
            }
            say(`I will add ${volume} of ${name} in your shopping list.`, function () {
              dashboard_shopping_post(name, volume, callback);
            });
        },
        function() {
            say(`cancelled`, callback);
        });
    }
    return false;
}

function action_list(str, callback) {
    if (str.match(/what/i)) {
      dashboard_shopping_get(function (res) {
        var items = "nothings";
        if (res && res.length) {
            items = "";
            res.forEach((item, res) => {
                items += `, ${item.volume} of ${item.name}`;
            });
        }
        say(`You have ${items} in your shopping list.`, callback);
     });
   } else {
     say(`I don't understand you.`, callback);
   }
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
