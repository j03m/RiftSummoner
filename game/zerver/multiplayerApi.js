
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

exports.findGame =  function(authToken, playerData, callback){
    blobLogic.convertToken(authToken, function(userToken){
        //pull an entry from the redis queue, use this to make a game
        var key = getMultiplayerQueueKey(playerData);
        var client = redisWrap.getClient(key);
        client.lpop(key, function(err, data){
            if (err){
                callback(err, undefined);
            }else{
                if (!data){
                    //no games
                    callback(undefined, undefined);
                }else{
                    //create a game between us


                }
            }
        })

    });
}

exports.registerForMatches =  function(authToken, callback){
    blobLogic.convertToken(authToken, function(userToken){
        //place my userToken in the match making queue when I log in
    });
}

function getMultiplayerQueueKey(playerData){
    //for now there is only one queue
    return  mpQueue + "level1";
}