

var redisWrap = require('./redisWrapper.js')
var error = require('./errors.js').error;
var blobApi = require('./blobApi.js');
var async = require('async');
var _ = require('underscore');
var mpNameSpace = "hotr:multiplayer:"
var mpBlobsKey = mpNameSpace + "blobs:";
var mpQueueKey = mpNameSpace + "queue:";
var ROBOT = "superumibot_";
var TOTAL_ALLOWED_GAMES = 25;

var getGames =  function(userToken, callback){
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
exports.getGames = getGames;

exports.getTeam = function(playerId, callback){

    blobApi.getBlob(playerId, function(err, res){
        if (err){
            error(500, "failed to get blob for multiplayer:" + playerId, err, callback);
        }else{
            var characterMap = {};
            _.each(res.myguys, function(character){
                characterMap[character.id] = character;
            });

            var formation = res.teamformation;

            var team = [];

            for (var i=0;i<formation.length; i++){
                if (formation[i]!=undefined){
                    if (characterMap[formation[i]]){       //no invalid ids
                        team[i]=characterMap[formation[i]];
                    }

                }
            }
            callback(undefined, {'team':team, 'formation':'4x4x4b'});
        }
    });

}

/*
*
* Random Team
*            if (playerId.substring(0,ROBOT.length) == ROBOT){
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
*
* */


exports.findGame =  function(userToken,  callback){
        getGames(userToken, function(err, games){
			var count = 0;
            for (var game in games){
                count++;
            }
            if (err || count > TOTAL_ALLOWED_GAMES){
				console.log("TOO MANY GAMES");
				error(403, "too many games", err, callback)
			}else{

                var key = getMultiplayerQueueKey(userToken);
		        var mpClient = redisWrap.getClient(key);
				
		        mpClient.srandmember(key, 5, function(err, data){
                    if (err){
						error(500, "Pop from multiplayer queue failed.", err, callback)
		            }else{
                        var op = undefined;
                        if (!games){
                            games = {};
                        }
                        for (var i=0;i<data.length;i++){
                            if (data[i]!= userToken && games[data[i]]==undefined){
                                op = data[i];
                                break;
                            }
                        }

                        if (op==undefined){
                            callback (undefined, undefined);
                        }else{
                            makeMatch(userToken, op, false, callback);
                        }
		            }
		        });
			}
		});
}

function makeRobotName(){
    return ROBOT + Math.floor((Math.random()*9999)+1);
}

function makeMatch(userToken, opponent, bot, mainCb){

    var opponentName;
    if (bot){
        opponentName =  makeRobotName();
    }else{
        opponentName = opponent; //todo? get a name?
    }

    //create a game between us
    var keyP1 = getMultiplayerBlobKey(userToken);
    var mp1Client = redisWrap.getClient(keyP1);
    var keyP2 =getMultiplayerBlobKey(opponentName);
    var mp2Client = redisWrap.getClient(keyP2);


    var operations = [
        function player1Mp(callback){
            makeMpGame(mp1Client, keyP1, userToken, opponentName, callback); // me vs them entry
        },
        function player2Mp(callback){
            makeMpGame(mp2Client, keyP2, opponentName, userToken,callback); // me vs them entry
        }
    ];

    async.parallel(operations, function(err, res){
        if (err){
            error(500, "creation of a multiplayer entry failed.", err, callback);
        }else{
            mainCb(undefined, opponentName);
        }
    });
}

exports.victory = function (userToken, opponent, data, mainCb){
     handleMultiplayerResult(userToken, opponent, data, true, mainCb);
}

exports.defeat = function (userToken, opponent, data, mainCb){
    handleMultiplayerResult(userToken, opponent, data, false, mainCb);
}

exports.register=register;
function register(userToken, callback){
	var key = getMultiplayerQueueKey(userToken);
	var mpClient = redisWrap.getClient(key);
	mpClient.sadd(key, userToken, function(err, res){
		if (err){
			error(500, "Push to multiplayer queue failed.", err, callback);
		}else{
			callback(undefined,true);
		}
	});
}


function handleMultiplayerResult(userToken, opponent, data,result, mainCb){
    var bot = false;
    if (opponent.substring(0,ROBOT.length) == ROBOT){
        bot = true;
    }

    var keyP1 = getMultiplayerBlobKey( userToken);
    var mp1Client = redisWrap.getClient(keyP1);

    var readOps = [
                    function(callback){
                        getMultiplayerGame(userToken, opponent, callback);
                    },
                    function(callback){
                        getMultiplayerGame(opponent, userToken, callback);
                    }
    ];


    async.parallel(readOps, function(err, res){
        if (err){
            errors(500, "failed to get one or more multiplayer games for: " + userToken + " vs " + opponent,err, mainCb);
        }

        var writeOps = [function(callback){
                            setMultiplayerResult(userToken, opponent, res[0], result, data, userToken, callback);
                        },
                        function(callback){
                            setMultiplayerResult(opponent,userToken, res[1], !result, data, userToken, callback);
                        }
        ];


        async.parallel(writeOps, function(err, res){
            if (err){
                errors(500, "failed to set the result for one or more multiplayer games for: " + userToken + " vs " + opponent, err, mainCb);
            }else{
                mainCb(undefined, true);
            }
        });

    });

}

function setMultiplayerResult(player1, player2, rawBlob, result, data, actionTaker, callback){
    var keyP1 = getMultiplayerBlobKey(player1);
    var mp1Client = redisWrap.getClient(keyP1);
    var blob = JSON.parse(rawBlob);

    if (blob.turn != actionTaker){
        console.log(actionTaker + " attempting to write game result out of turn. Player1: " + player1 + " Player2: " + player2 + " Actiontaker: " + actionTaker);
        callback(undefined, false);
        return;
    }

    blob.lastMatchData = data;


    if (result == 1){
        blob[player1].wins++;
        blob.lastMatchResult = 1;
    }else{
        blob[player2].wins++;
        blob.lastMatchResult = 0;
    }

    //swap turns
    if (blob.turn == player1){
        blob.turn = player2;
    }else{
        blob.turn = player1;
    }

    var blobString = JSON.stringify(blob);
    mp1Client.hset(keyP1, player2, blobString, callback);

}

function getMultiplayerGame(player1, player2, callback){
    var keyP1 = getMultiplayerBlobKey(player1);
    var mp1Client = redisWrap.getClient(keyP1);
    mp1Client.hget(keyP1, player2, callback);
}

function getMultiplayerBlobKey(player){
    return mpBlobsKey + player;
}

function getMultiplayerQueueKey(playerData){
    //for now there is only one queue
    return  mpQueueKey + "level1"; //future, hash userid, look at data by level etc
}

function makeMpGame(client, key, me, op, callback){
	var gameBlob= {"turn":me};
	gameBlob[me] = {"wins":0};
	gameBlob[op] = {"wins":0};

	var blobString = JSON.stringify(gameBlob);	
	client.hset(key, op, blobString, callback);
}