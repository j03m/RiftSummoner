var error = require('./errors.js').error;
var redisWrap = require('./redisWrapper.js');
var uuid = require('node-uuid');
var crypto = require('crypto');


var sessionTTL = 24*60*60;
var sessionTTLMS = sessionTTL*1000;
var sessionNameSpace = "hotr:session:";
var credentialsNameSpace = "hotr:creds:";


exports.uniqueToken = uniqueToken;
exports.makeAuthToken = makeAuthToken;
exports.convertToken = convertToken;
exports.saveCreds = saveCreds;
exports.verify = verify;
exports.getAuthToken = getAuthToken;


exports.validate = function(params){
	return function(req, res, next){
		for(var i=0; i<params.length; i++){
			var param = params[i];
			if (!req.params[param]){
				res.send(400, "parameter:"+param+ " not found in request.");
				return;
			}
		}
		req.validated = true;
		next();
	}
}

exports.verifyRequest = function(req, res, next){
	verify(req.params.id, req.params.data,req.params.hash,function(err, response){
		if(err){
			res.send(err.code);
		}else{
			next();
		}
	});
	
}

exports.convert = function(req, res, next){
	convertToken(req.params.token,function(err, response){
		if(err){
			res.send(err.code);
		}else{
			req.userToken = response;
			next();
		}
	});
	
}

function getAuthToken(id, data, hash, callback){
	verify(id, data, hash, function(err, res){
        if (err){
            callback(err);
        }else{
            if (res){
                makeAuthToken(id, callback);
            }else{
                callback("Verification failed, hash invalid", undefined);
            }
        }
    });
}

function uniqueToken(){
    return uuid.v4(); //implement me, maybe guid, maybe not sure.
}

function saveCreds(id, pass, cb){
    redisWrap.set(credentialsNameSpace+id, pass, function(err, result){
		if (err){
			error(500, "failed to save creds", err, cb);
		}else{
			cb(err, result);
		}
    });
}

function makeAuthToken(userToken, callback){
    //if cool generate a session token
    var sessionToken = uniqueToken();

    //store the kik token in redis with the session token, ttl of 24hrs
    redisWrap.multi(
        [["set", sessionNameSpace+sessionToken, userToken],
            ["expire", sessionNameSpace+sessionToken, sessionTTL]]
    ).exec(function (err, replies) {
            if (err){
			   error(500, "Failed to set session token in Redis: " + JSON.stringify(err), err, callback);
            }else if (replies[0]!="Ok" && replies[1]!=1){
				error(500, "Failed to set session token in Redis: " + JSON.stringify(replies), undefined, callback);
            }else{
                callback(undefined, {token:sessionToken, expires:Date.now()+sessionTTLMS});
            }
		});
}

function convertToken(authToken, callback){
    redisWrap.get(sessionNameSpace+authToken, function(err, res){
        if (err){
         	error(500, "Error: could not convert supplied token:" +authToken, err, callack);
        }else if (!res){
            error(403, "Could not convert authToken: " + authToken + " to valid user.", undefined, callback);
        }else{
        	//todo: check expiration here!
			callback(undefined, res);			
        }
    });
}



function verify(id, data, hash, cb){
    //get the secret
    redisWrap.get(credentialsNameSpace+id, function(err, secret){
        if (err){
			error(500, "failed to find credentials for:"+id + " in redis", err, cb);
        }else{
            //with the pass, remake the sig
			console.log("data:" + data);
			console.log("secret:" + secret);			
            var combo = data+secret;
			console.log("combo:" + combo);
            var serverHash = crypto.createHash('md5').update(combo).digest('hex');
            if (serverHash == hash){
                cb(undefined, true);
            }else{
                error(403, "Id: " + id + " Data:" + data + " Hash:" + hash + " did not validate. Server hash: " + serverHash, err, cb);
            }
        }
    });
}

