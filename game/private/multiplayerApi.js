

var redisWrap = require('./redisWrapper.js')
var error = require('./errors.js').error;
var blobApi = require('./blobApi.js');
var async = require('async');
var mpNameSpace = "hotr:multiplayer:"
var mpBlobsKey = mpNameSpace + "blobs:";
var mpQueueKey = mpNameSpace + "queue:";
var ROBOT = "superumibot_";
exports.getGames =  function(userToken, callback){
    var key = mpBlobsKey+userToken;
    redisWrap.getClient(key).hgetall(key, function(err, data){
        if (err){
            callback(err, undefined);
            return;
        }
		//ew
		for(var key in data){
			data[key] = JSON.parse(data[key]);
		}
        callback(err, data);
    });
}

var countGames = function(userToken, callback){
    var key = mpBlobsKey+userToken;
    redisWrap.getClient(key).hlen(key, function(err, data){
    	if (err){
    		error(500, "failed to count # of games in redis", err, callback);
    	}else{
    		callback(err, data);
    	}
    });   	
}

exports.getTeam = function(playerId, callback){
	if (playerId.substring(0,ROBOT.length) == ROBOT){
		//generate random team
		blobApi.makePlayerData(playerId, function(err, res){
			var characters = Math.floor((Math.random()*48-1)+1);
			if (characters>12){
				characters = 12;
			}
			var team = [];
			console.log("random response:");
			console.log(JSON.stringify(res));
			
			for(var i =0;i<characters;i++){
					var who = Math.floor((Math.random()*res.myguys.length-1)+1);
					team.push(res.myguys[who]);
			}
			callback(undefined, {'team':team, 'formation':"4x4x4b"});
		});
	}else{
		blobApi.getBlob(playerId, function(err, res){
			if (err){
				error(500, "failed to get blob for multiplayer:" + playerId, err, callback);
			}else{
				callback(undefined, {'myguys':res.myguys, 'formation':res.formation});
			}
		});
	}
}
var TOTAL_ALLOWED_GAMES = 25;
exports.findGame =  function(userToken,  callback){        
		countGames(userToken, function(err, res){
			if (err || res > TOTAL_ALLOWED_GAMES){
				console.log("TOO MANY GAMES");
				error(403, "too many games", err, callback)
			}else{
				var key = getMultiplayerQueueKey(userToken);
		        var mpClient = redisWrap.getClient(key);
				
		        mpClient.lpop(key, function(err, data){
					console.log("wtf is data: " + data);
					console.log("data instance of string: " + data instanceof String);
		            if (err){
						error(500, "Pop from multiplayer queue failed.", err, callback)
		            }else{
						var bot = false;
						var originalData;
						if (data == undefined || data == userToken){
		                    //if no games or if this is me, make a bot for me to play
							console.log("No players, bot time. ARMS EXTENDO!!!" + data);
							bot = true;
							originalData = data;
							data = ROBOT + Math.floor((Math.random()*9999)+1);;
						}
				
						if (originalData != undefined){
							mpClient.rpush(key, originalData, function(err, res){
								if (err){
									console.log("Push to multiplayer queue failed." + JSON.stringify(err));
								}
							});											
						}	
				
							    
						//create a game between us
						var keyP1 = mpBlobsKey + userToken;
						var mp1Client = redisWrap.getClient(keyP1);

						if (!bot){
							var keyP2 = mpBlobsKey + data;
							var mp2Client = redisWrap.getClient(keyP2);					
							var operations = [
								function player1Mp(callback){
									makeMpGame(mp1Client, keyP1, userToken, data, callback); // me vs them entry
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
	gameBlob= {
							"turn":me,
						 };
	gameBlob[me] = {"wins":0};
	gameBlob[op] = {"wins":0};

	var blobString = JSON.stringify(gameBlob);	
	client.hset(key, op, blobString, callback);
}