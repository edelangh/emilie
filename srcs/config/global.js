
if (!process.env["GOOGLE_SPEECH_KEY"]) {
    console.log("[config][error] pliz export your GOOGLE_SPEECH_KEY");
    process.exit();
}

exports.google = {
    "url": "https://content-speech.googleapis.com",
    "page": "/v1/speech:recognize",
    "key" : process.env["GOOGLE_SPEECH_KEY"]
}
