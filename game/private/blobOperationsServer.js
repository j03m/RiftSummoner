var cardGen = require('./cardGen.js').generateCards;
var getEveryone = require('./cardGen.js').getEveryone;
var uuid = require('node-uuid');
var redisWrap = require('./redisWrapper.js');
var crypto = require('crypto');

var sessionTTL = 24*60*60;
var sessionTTLMS = sessionTTL*1000;
var sessionNameSpace = "hotr:session:";
var credentialsNameSpace = "hotr:creds:";
var blobNameSpace = "hotr:blob:";



function newPlayer(userId, callback){
    //make 6 cards for this player
    cardGen(3,6, function(err, res){
        var blob = {};
        blob["id"] = userId;
        blob.myguys = getEveryone();
        blob.coins = 50;
        blob.stones = 3;
        blob.version = 0;
        callback(err, blob);
    });
}



function uniqueToken(){
    return uuid.v4(); //implement me, maybe guid, maybe not sure.
}

function saveCreds(id, pass, cb){
    redisWrap.set(credentialsNameSpace+id, pass, cb);
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
                throw err;
            }
            if (replies[0]!="Ok" && replies[1]!=1){
                throw "Failed to set session token in Redis: " + JSON.stringify(replies);
            }else{
                callback({token:sessionToken, expires:Date.now()+sessionTTLMS});
            }
        });
}


function convertToken(authToken, callback){
    console.log("Convert token: " + authToken);
    redisWrap.get(sessionNameSpace+authToken, function(err, res){
        if (err){
            throw err;
        }
        var userToken = res;
        if (!res){
            console.log("Could not convert authToken: " + authToken + " to valid user.");
            callback(undefined);
            return;
        }
        console.log("Converted to: " + userToken);
        callback(userToken);
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

function newPlayerApi(authToken, callback){
    convertToken(authToken, function(userToken){
        if(!userToken){
            callback({error:"session invalid"});
        }else{
            newPlayer(userToken, function(err, newBlob){
                if (err){
                    throw err;
                }
                setBlob(userToken, newBlob, callback);
            });
        }
    });
}


function readBlob(userToken, callback){
    console.log("Blob Read:" + blobNameSpace+userToken);
    redisWrap.get(blobNameSpace+userToken, function(err, blob){
        if (err){
            throw err;
        }

        console.log("Blob Result:" + blob);
        if (blob){
            callback(JSON.parse(blob));
        }else{
            callback(blob);
        }
    });
}

function verify(id, data, hash, cb){
    //get the secret
    redisWrap.get(credentialsNameSpace+id, function(err, secret){
        if (err){
            cb(err, undefined);
        }else{
            //with the pass, remake the sig
            var combo = data +secret;
            var serverHash = crypto.createHash('md5').update(combo).digest('hex');
            if (serverHash == hash){
                cb(undefined, true);
            }else{
                cb(undefined, false);
            }
        }
    });
}

exports.newPlayer = newPlayerApi;
exports.uniqueToken = uniqueToken;
exports.makeAuthToken = makeAuthToken;
exports.convertToken = convertToken;
exports.setBlob = setBlob;
exports.newPlayer = newPlayer;
exports.readBlob = readBlob;
exports.saveCreds = saveCreds;
exports.verify = verify;
