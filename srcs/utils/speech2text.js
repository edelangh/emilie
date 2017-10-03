
const fs = require('fs');
const request = require('request');
const config = require('../config/global.js');

const headers = {
    'Content-Type' : 'application/json',
};

var options = {
    uri : `${config.google.url}${config.google.page}?alt=json&key=${config.google.key}`,
    method : 'POST',
    headers : headers
};

exports.speech2text = (file, callback) => {
    const body = {
        audio: {
            content: fs.readFileSync(file).toString('base64')
        },
        config: {
            encoding: "LINEAR16",
            languageCode: "en-US",
            sampleRateHertz: 16000,
        }
    }
    options.body = JSON.stringify(body);
    request(options, callback);
}
