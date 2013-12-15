
var auth = require('./auth.js');
var cardGen = require('./cardGen.js').generateCards;
var getEveryone = require('./cardGen.js').getEveryone;
var uuid = require('node-uuid');
var redisWrap = require('./redisWrapper.js');
var crypto = require('crypto');
var errors = require('./errors.js');

var sessionTTL = 24*60*60;
var sessionTTLMS = sessionTTL*1000;
var sessionNameSpace = "hotr:session:";
var credentialsNameSpace = "hotr:creds:";
var blobNameSpace = "hotr:blob:";


function newPlayer(userId, callback){
    //make 6 cards for this player
    cardGen(3,6, function(err, res){
		if (err){
			errors(500, "failed on card gen", err, callback);
		}else{
	        var blob = {};
	        blob["id"] = userId;
	        blob.myguys = getEveryone();
	        blob.coins = 50;
	        blob.stones = 3;
	        blob.version = 0;
	        callback(err, blob);
			
		}
    });
}

function setBlob(userToken, blob, callback){
    //save it
    redisWrap.set(blobNameSpace+userToken, JSON.stringify(blob), function(err, setResult){
        if (err){
            throw err;
        }
        if (setResult.toLowerCase()!="ok"){
            throw "Failed to set blob: " + setResult + " for user:" + userToken + " blob:" + blob;
        }
        callback(setResult);
    });
}

function newPlayerApi(userToken, callback){
    newPlayer(userToken, function(err, newBlob){
        if (err){
			callback(err);
        }else{
			setBlob(userToken, newBlob, callback);        	
        }

    });
}

function readBlob(userToken, callback){
    redisWrap.get(blobNameSpace+userToken, function(err, blob){
        if (err){
			errors(500, "Failed to read blob from redis", err, callback);
        }else{
	        if (blob){
	            callback(JSON.parse(blob));
	        }else{
	            error(500, "Couldn't find a blob for: " + userToken, undefined, callback);
	        }        	
        }
    });
}

exports.saveBlob =  function(authToken, blob, callback){
    //first, we need to get the current blob
    auth.convertToken(authToken, function(userToken){
        if(!userToken){
            callback({error:"session invalid"});
        }else{
            readBlob(userToken, function(storedBlob){
                if (storedBlob.version < blob.version){
                    setBlob(userToken, blob, callback);
                }else{
                    console.log("Stored blob is version: " + storedBlob.version + " attempting to overwrite with: " + blob.version);
                    callback(undefined);
                }
            });
        }
    });
}

exports.createNewPlayer = function(id, pass, callback){
    //store creds
    auth.saveCreds(id, pass, function(err, data){
		if (err){
			callback(err)
			return;
		}
        auth.makeAuthToken(id, function(err, tokenObj){
			if (err){
				callback(err);
				return;
			}
            newPlayer(id, function(err, newBlob){
				if (err){
					callback(err);
					return;
				}else{
					callback(err, {blob:newBlob, token:tokenObj});
				}
            });
        });
    });
}

exports.getNewAuthTokenAndBlob = function(userToken, callback){
	auth.makeAuthToken(userToken, function(err, authTokenObj){					
		if (err){
			callback(err);
		}else{
			readBlob(userToken, function(err, blob){
                callback(err, authTokenObj, blob);
            });					
		}
    });            
}

exports.getBlob = function(authToken, callback){
    //get usertoken from session token
    convertToken(authToken, function(userToken){
        if(!userToken){
            callback({error:"session invalid"});
        }else{
            //get blob
            readBlob(userToken, function(blob){
                callback(blob);
            });
        }
    });
}


exports.newPlayer = newPlayerApi;
exports.setBlob = setBlob;
exports.newPlayer = newPlayer;
exports.readBlob = readBlob;

