
var auth = require('./auth.js');
var cardGen = require('./cardGen.js').generateCards;
var getEveryone = require('./cardGen.js').getEveryone;
var redisWrap = require('./redisWrapper.js');
var error = require('./errors.js').error;

var blobNameSpace = "hotr:blob:";


function newPlayer(userId, callback){
    //make 6 cards for this player
    cardGen(3,6, function(err, res){
		if (err){
			error(500, "failed on card gen", err, callback);
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
            error(500, "Could not set: " + userToken + " blob in storage.", err, callback)
        }else if (setResult.toLowerCase()!="ok"){
			error(500, "Failed to set blob: " + setResult + " for user:" + userToken + " blob:" + blob, undefined, callback);
        }else{
			callback(undefined, setResult);        	
        }
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
			error(500, "Failed to read blob from redis", err, callback);
        }else{
	        if (blob){
	            callback(undefined, JSON.parse(blob));
	        }else{
	            error(500, "Couldn't find a blob for: " + userToken, undefined, callback);
	        }        	
        }
    });
}

exports.saveBlob =  function(userToken, blob, callback){
    //first, we need to get the current blob
    readBlob(userToken, function(err, storedBlob){
		if (err){
			error(500, "Could not read: " + userToken + " blob from storage.", err, callback)
		}else if (storedBlob.version >= blob.version){
            error(400, "Stored blob is version: " + storedBlob.version + " attempting to overwrite with: " + blob.version, undefined, callback);
        }else{
            setBlob(userToken, blob, callback);			
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
                callback(err, {'token':authTokenObj, 'blob':blob});
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
            readBlob(userToken, function(err, blob){
                callback(err, blob);
            });
        }
    });
}


exports.newPlayer = newPlayerApi;
exports.setBlob = setBlob;
exports.newPlayer = newPlayer;
exports.readBlob = readBlob;

