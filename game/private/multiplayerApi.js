
var blobLogic = require('../private/blobOperationsServer.js');
var redisWrap = require('../private/redisWrapper.js')
var mpNameSpace = "hotr:multiplayer:"
var mpBlobs = mpNameSpace + "blobs:";
var mpQueue = mpNameSpace + "queue:";
exports.getGames =  function(authToken, callback){
    blobLogic.convertToken(authToken, function(userToken){
        var key = mpBlobs+userToken;
        redisWrap.getClient(key).hgetall(key, function(err, data){
            if (err){
                callback(err, undefined);
                return;
            }
            var res = JSON.parse(data);
            callback(err, res);
        });
    });
}


//TODO: left off here - yank zerver go with routes, - authtoken + blob lookup can happen before this logic 
exports.findGame =  function(authToken,  callback){
    blobLogic.convertToken(authToken, function(userToken){
        //pull an entry from the redis queue, use this to make a game
		blobLogic.getBlob(userToken, function(blob){
	        var key = getMultiplayerQueueKey(userToken);
	        var mpClient = redisWrap.getClient(key);
	        mpClient.lpop(key, function(err, data){
	            if (err){
	                callback(err, undefined);
	            }else{

					if (!data){
	                    //no games, make a bot
                    
						callback(undefined, undefined);
	                }else{
	                    //create a game between us
						var keyP1 = mpBlobs + userToken;
						var keyP2 = mpBlobs + data; 
					
						var mp1Client = redisWrap.getClient(keyP1);
						var mp2Client = redisWrap.getClient(keyP2);
					
						var operations = [
						function player1Mp(callback){
							makeMpGame(mp1Client, keyP1, callback);
						}
						];
	
					
					
						//add a game to both of our multiplayer hashes
						mpClient.rpush(key, data, function(err, data){
							if (err){
								console.log("Couldn't put player back into queue.");
							}
						});
	                }
	            }
	        })

	    });			
	});
}

exports.registerForMatches =  function(authToken, callback){
    blobLogic.convertToken(authToken, function(userToken){
        //place my userToken in the match making queue when I log in
    });
}

function getMultiplayerQueueKey(playerData){
    //for now there is only one queue
    return  mpQueue + "level1"; //future, hash userid, look at data by level etc
}