var kikcards = require('kik-cards').kik;
var kikMock = require('../private/kikServerMock.js');
var blobLogic = require('../private/blobOperationsServer.js');
var config = require('../html5/config.js').hotrConfig;
if (!config.prod){
    kikcards = kikMock.cardApi;
}


//todo: update to use ring + pass off read failures
var redis = require("redis"),
    client = redis.createClient();

var sessionTTL = 24*60*60;
var sessionTTLMS = sessionTTL*1000;
var sessionNameSpace = "hotr:session:";
var blobNameSpace = "hotr:blob:";


/*********************PUBLIC API - EVERYTHING HERE  (exports.) CAN BE HIT OVER REST HTTP ***********************/

exports.saveBlob =  function(authToken, blob, callback){
    //first, we need to get the current blob
    convertToken(authToken, function(userToken){
        readBlob(userToken, function(storedBlob){
            if (storedBlob.version < blob.version){
                setBlob(userToken, blob, callback);
            }else{
                throw "Stored blob is version: " + storedBlob.version + " attempting to overwrite with: " + blob.version;
            }
        });
    });
}


exports.createNewPlayer = function(signedData, userToken, host, callback){
    //first, check if this player actually exists, if I have a blob for this player, throw an exception
    console.log("pre-kik-verify");
    console.log("post-kik-verify");
    console.log("data:" + JSON.stringify(signedData));
    console.log("userToken:" + JSON.stringify(userToken));
    console.log("host:" + JSON.stringify(host));
    kikcards.verify(userToken, host, signedData, function(err, res){
        console.log("kik verification err: " + err);
        console.log("kik verification response: " + res);
        if (err){
            console.log("Kik verification failed: " + err);
            callback(undefined);
        }else{
            //do a blob read for this user - its possible we can end up in this function if local storage
            //gets nuked. We can't allow that to nuke an existing user. So, don't overwrite them use the blob we find.
            //using this system, local storage would need to be erased and we would have to have a redis read fail
            //to wipe users
            readBlob(userToken, function(blobRes){
                if (blobRes){ //have a blob for this user already - don't let them be overwritten
                    console.log("User: " + userToken + " is already initialized."); //todo: need logging framework
                    makeAuthToken(userToken, function(tokenObj){
                        callback(blobRes,tokenObj);
                    });
                }else{
                    //doesn't exist, make an authtoken, create a blob return it all
                    console.log(" No blob init new player");
                    makeAuthToken(userToken, function(tokenObj){
                        //make a blob
                        console.log(" Made Token:" + tokenObj);
                        blobLogic.newPlayer(userToken, function(err, newBlob){

                            console.log(" new player Logic:" + newBlob);
                            setBlob(userToken, newBlob, function(result){
                                //setBlob checks response and throws
                                console.log(" saved blob:" + newBlob);
                                callback(newBlob, tokenObj);
                            });
                        });
                    });
                }
            });
        }
    });



}

exports.getNewAuthTokenAndBlob = function(signedData, userToken, host, callback){
    console.log("getNewAuthTokenAndBlob - pre-kik.anonymousVerify");
    console.log("post-kik.anonymousVerify");
    console.log("data:" + JSON.stringify(signedData));
    console.log("userToken:" + JSON.stringify(userToken));
    console.log("host:" + JSON.stringify(host));
    kikcards.verify(userToken, host, signedData, function(err, res){
        console.log("kik verification err: " + err);
        console.log("kik verification response: " + res);
        if (err){
            console.log("Kik verification failed: " + err);
            callback(undefined);
        }else{
            makeAuthToken(userToken, function(authTokenObj){
                readBlob(userToken, function(blob){
                    if (!blob){
                        throw "No blob for user: " + userToken;
                    }
                    callback(authTokenObj, blob);
                });
            });
        }
    });
}


exports.getBlob = function(authToken, callback){

    //get usertoken from session token
    convertToken(authToken, function(userToken){
        if (userToken==undefined){
            throw "No user for session: " + authToken + " found.";
        }else{
            //get blob
            readBlob(userToken, callback);
        }
    });
}

exports.getAuthToken = function(signedData, userToken, host, callback){
    //.anonymousVerify with kik
    kikcards.verify(userToken, host, signedData, function(err, res){
        if (err){
            console.log("Kik verification failed: " + err);
            callback(undefined);
        }else{
            makeAuthToken(userToken, callback);
        }
    });
}


/*********************PRIVATE API********************************/

function makeAuthToken(userToken, callback){
    //if cool generate a session token
    var sessionToken = blobLogic.uniqueToken();

    //store the kik token in redis with the session token, ttl of 24hrs
    multi(
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
    get(sessionNameSpace+authToken, function(err, res){

        if (err){
            throw err;
        }
        var userToken = res;
        if (!res){
            throw "Could not convert authToken: " + authToken + " to valid user.";
        }
        console.log("Converted to: " + userToken);
        callback(userToken);
    });
}

function setBlob(userToken, blob, callback){
    //save it
    set(blobNameSpace+userToken, JSON.stringify(blob), function(err, setResult){
        if (err){
            throw err;
        }
        if (setResult.toLowerCase()!="ok"){
            throw "Failed to set blob: " + setResult + " for user:" + userToken + " blob:" + blob;
        }
        callback(setResult);
    });
}

function newPlayer(authToken, callback){
    convertToken(authToken, function(userToken){
        blobLogic.newPlayer(userToken, function(err, newBlob){
            if (err){
                throw err;
            }
            setBlob(userToken, newBlob, callback);
        });
    });
}

function readBlob(userToken, callback){
    console.log("Blob Read:" + blobNameSpace+userToken);
    get(blobNameSpace+userToken, function(err, blob){
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

function get(key, cb){
    //for now return client, but todo: implement hashring
    return client.get(key, cb);
}

function set(key, val, cb){
    //for now return client, but todo: implement hashring
    return client.set(key,val, cb);
}

function multi(cmds){
    //for now return client, but todo: implement hashring
    return client.multi(cmds);
}

