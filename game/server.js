var fs = require('fs');
var util = require('util');
var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var zerver = require('zerver');
var config = require('./private/config.js').hotrConfig;

if (config.prod){
    //This line is from the Node.js HTTPS documentation.
    var options = {
        key: fs.readFileSync('cert/riftsummoner-key.pem'),
        cert: fs.readFileSync('cert/final.crt')
    };

}

app.use(express.compress());
app.use('/src', express.static(__dirname + "/src"));  //game src
app.use(express.static(__dirname + "/public")); //html and built js files
app.use('/html5', express.static(__dirname + "/html5"));  //html5 specific stuff
app.use('/platform', express.static(__dirname + "/platform")); //cocos2d raw
app.use('/art', express.static(__dirname + "/art")); //art - tbd replaced by urls to cdn
app.use(zerver.middleware());

// Create an HTTP service.
http.createServer(app).listen(80);

// Create an HTTPS service identical to the HTTP service.
if (config.prod){
    https.createServer(options, app).listen(443);
}

//require controllers, pass app, create restful targets



util.puts('Press Ctrl + C to stop.');


//app.use(zerver.middleware());
//app.use(express.compress());
//app.use(express.static(__dirname + "/src"));
//fs.readdir(__dirname, function(err, results){
//    for (var i =0; i<results.length; i++){
//        console.log(results[i]);
//        app.use(express.static(results[i]));
//    }
//    // Create an HTTP service.
//    http.createServer(app).listen(80);
//    // Create an HTTPS service identical to the HTTP service.
//    if (config.prod){
//        https.createServer(options, app).listen(443);
//    }
//
//    util.puts('Press Ctrl + C to stop.');
//});

