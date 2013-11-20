var fs = require('fs');
var util = require('util');
var zerver = require('zerver');
var express = require('express');
var app = express();

port = 1337;
app.use(zerver.middleware())
app.use(express.static(__dirname ));
fs.readdir(__dirname, function(err, results){
    for (var i =0; i<results.length; i++){
        console.log(results[i]);
        app.use(express.static(results[i]));
    }
    app.listen(port);
    util.puts('Listening on ' + port + '...');
    util.puts('Press Ctrl + C to stop.');
});



