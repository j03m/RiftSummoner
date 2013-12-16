
var blobLogic = require('../private/blobOperationsServer.js');
var redisWrap = require('../private/redisWrapper.js')
var error = require('./errors.js').error;

var mpNameSpace = "hotr:multiplayer:"
var mpBlobsKey = mpNameSpace + "blobs:";
var mpQueueKey = mpNameSpace + "queue:";

exports.getGames =  function(authToken, callback){
    var key = mpBlobs+userToken;
    redisWrap.getClient(key).hgetall(key, function(err, data){
        if (err){
            callback(err, undefined);
            return;
        }
        var res = JSON.parse(data);
        callback(err, res);
    });
}


//TODO: left off here - yank zerver go with routes, - authtoken + blob lookup can happen before this logic 
exports.findGame =  function(userToken,  callback){
        var key = getMultiplayerQueueKey(userToken);
        var mpClient = redisWrap.getClient(key);
        mpClient.lpop(key, function(err, data){
            if (err){
				error(500, "Pop from multiplayer queue failed.", err, callback)
            }else{
				var bot = false;
				if (!data || data == userToken){
                    //if no games or if this is me, make a bot for me to play
					bot = true;
				}	
				
				//push me into the queue for someone else, non block shouldn't stop play on fail
				if (data == userToken){
					mpClient.rpush(key, data, function(err, res){
						if (err){
							console.log("Push to multiplayer queue failed." + JSON.stringify(err));
						}
					});						
				}					

                
				//push whoever back into the queue
				mpClient.rpush(key, data, function(err, res){
					if (err){
						console.log("Push to multiplayer queue failed(2)." + JSON.stringify(err));
					}
				});	
				
				if (bot){
					data = "robot";
				}					
				
				//create a game between us
				var keyP1 = mpBlobsKey + userToken;
				var mp1Client = redisWrap.getClient(keyP1);

				if (!bot){
					var keyP2 = mpBlobsKey + data;
					var mp2Client = redisWrap.getClient(keyP2);					
					var operations = [
						function player1Mp(callback){
							makeMpGame(mp1Client, keyP1, userToken, data callback); // me vs them entry
						},
						function player2Mp(callback){
							makeMpGame(mp2Client, keyP2, data, userToken, callback); //them vs me entry
						},
					
					];
					
				}else{					
					var operations = [
						function player1Mp(callback){
							makeMpGame(mp1Client, keyP1, userToken, data, callback); //me vs robot entry
						},					
					];
				}
							
				async.waterfall(operations, function(err, res){						
					if (err){
						error(500, "creation of a multiplayer entry failed.", err, callback);
					}else{
						callback(undefined, data);								
					}												
				});							                
            }
        });		
}

exports.register =  function(userToken, callback){
	var key = getMultiplayerQueueKey(userToken);
	var mpClient = redisWrap.getClient(key);
	mpClient.rpush(key, userToken, function(err, res){
		if (err){
			error(500, "Push to multiplayer queue failed.", err, callback);
		}else{
			callback(undefined,true);
		}
	});
}

function getMultiplayerQueueKey(playerData){
    //for now there is only one queue
    return  mpQueueKey + "level1"; //future, hash userid, look at data by level etc
}

function makeMpGame(client, key, me, op, callback){
	var players = [me, op];
	var gameKey = players.sort().join(':');
	var gameBlob = {
						gameKey:{
							"turn":me,
							"me":me,
							"op":op,			
							me:{							
								"wins":0
							},
							op:{
								"wins":0
							}
						}
					};
									
	client.hset(key, op, gameBlob, callback);
}