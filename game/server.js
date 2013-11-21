var fs = require('fs');
var util = require('util');
var zerver = require('zerver');
var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var config = require('./html5/config.js').hotrConfig;

if (config.prod){
    //This line is from the Node.js HTTPS documentation.
    var options = {
        key: fs.readFileSync('cert/riftsummoner-key.pem'),
        cert: fs.readFileSync('cert/final.crt')
    };

}



app.use(zerver.middleware())
app.use(express.static(__dirname ));
fs.readdir(__dirname, function(err, results){
    for (var i =0; i<results.length; i++){
        console.log(results[i]);
        app.use(express.static(results[i]));
    }
    // Create an HTTP service.
    http.createServer(app).listen(80);
    // Create an HTTPS service identical to the HTTP service.
    if (config.prod){
        https.createServer(options, app).listen(443);
    }

    util.puts('Press Ctrl + C to stop.');
});



