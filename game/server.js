var fs = require('fs');
var util = require('util');
var express = require('express');
var app = express();
var https = require('https');
var http = require('http');
var config = require('./private/config.js').hotrConfig;
var auth = require('./private/auth.js');
var blobApi = require('./private/blobApi.js');
var multiplayerApi = require('./private/multiplayerApi.js');

if (config.prod){
    //This line is from the Node.js HTTPS documentation.
    var options = {
        key: fs.readFileSync('cert/riftsummoner-key.pem'),
        cert: fs.readFileSync('cert/final.crt')
    };

}

function log(obj){
	console.log(JSON.stringify(obj));
}

function logError(err){
	console.error(err.stack);	
}

function logErrors(err, req, res, next) {
	console.error(err);
  	next(err);
}

function errorHandler(err, req, res, next) {
	logError(err);
	res.send(500);
}

function handler(res, err, data){
	if (err){
		log(err);
		res.json(err.code, err.msg);
	}else{
		console.log("data:");
		console.log(data);
		res.json(200,data);					
	}
}

app.use(express.compress());
app.use('/src', express.static(__dirname + "/src"));  //game src
app.use(express.static(__dirname + "/public")); //html and built js files
app.use('/html5', express.static(__dirname + "/html5"));  //html5 specific stuff
app.use('/platform', express.static(__dirname + "/platform")); //cocos2d raw
app.use('/art', express.static(__dirname + "/art")); //art - tbd replaced by urls to cdn
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(logErrors);
app.use(errorHandler);

var validate = auth.validate;
var verify = auth.verifyRequest;
var convert = auth.convert;

app.get('/app/createplayer/:id/:pass', validate(['id','pass']), function(req, res){
	if (config.prod){
		if (!req.connection.encrypted){
			res.json(403.4, "SSL Required.");
			return;
		}
	}

	blobApi.createNewPlayer(req.params.id, req.params.pass, function(err, data){
		console.log("err:" + err);
		console.log("data:" + data);
		console.log("res:" + res);
		handler(res, err, data);
	});
});

app.get('/app/gettokenandblob/:id/:data/:hash', validate(['id', 'data','hash']), verify, function(req, res){
	blobApi.getNewAuthTokenAndBlob(req.params.id, function(err, data){
		handler(res, err, data);
	});
});

app.get('/app/getblob/:token', validate(['token']), convert, function(req, res){
	blobApi.getBlob(req.userToken, function(err, data){
		handler(res, err, data);
	});
});

app.post('/app/saveblob/:token', validate(['token']), convert, function(req,res){
	blobApi.saveBlob(req.userToken, req.body,function(err, data){
		handler(res, err, data);
	});
});

app.get('/app/findgame/:token', validate(['token']), convert, function(req,res){
	multiplayerApi.findGame(req.userToken, function(err, data){
		handler(res, err, data);
	});
});

app.get('/app/getgames/:token', validate(['token']), convert, function(req,res){
	multiplayerApi.getGames(req.userToken, function(err, data){
		handler(res, err, data);
	});
});

app.get('/app/getteam/:token/:opponent', validate(['token', 'opponent']), convert, function(req,res){
	multiplayerApi.getTeam(req.params.opponent, function(err, data){
		handler(res, err, data);
	});
});

// Create an HTTP service.
http.createServer(app).listen(80);

// Create an HTTPS service identical to the HTTP service.
if (config.prod){
    https.createServer(options, app).listen(443);
}

util.puts('Press Ctrl + C to stop.');
