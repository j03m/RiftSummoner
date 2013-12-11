
var blobLogic = require('../private/blobOperationsServer.js');


/*********************PUBLIC API - EVERYTHING HERE  (exports.) CAN BE HIT OVER REST HTTP ***********************/
exports.saveBlob =  function(authToken, blob, callback){
    //first, we need to get the current blob
    blobLogic.convertToken(authToken, function(userToken){
        if(!userToken){
            callback({error:"session invalid"});
        }else{
            blobLogic.readBlob(userToken, function(storedBlob){
                if (storedBlob.version < blob.version){
                    blobLogic.setBlob(userToken, blob, callback);
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
    blobLogic.saveCreds(id, pass, function(err, data){
        blobLogic.makeAuthToken(id, function(tokenObj){
            //make a blob
            console.log(" Made Token:" + tokenObj);
            blobLogic.newPlayer(id, function(err, newBlob){
                console.log(" new player Logic:" + newBlob);
                blobLogic.setBlob(id, newBlob, function(result){
                    //setBlob checks response and throws
                    console.log(" saved blob:" + newBlob);
                    callback(newBlob, tokenObj);
                });
            });
        });
    });
}

exports.getNewAuthTokenAndBlob = function(id, data, hash, callback){
    blobLogic.verify(id, data, hash, function(err, res){
        if (err){
            console.log("verification failed with error: " + err);
            callback(undefined);
        }else{
            if (res){
                blobLogic.makeAuthToken(userToken, function(authTokenObj){
                    blobLogic.readBlob(userToken, function(blob){
                        if (!blob){
                            throw "No blob for user: " + userToken;
                        }
                        callback(authTokenObj, blob);
                    });
                });
            }else{
                console.log("Verification failed, hash invalid: " + id + "," + data + "," + hash);
                callback("Verification failed, hash invalid", undefined);
            }
        }
    });
}

exports.getBlob = function(authToken, callback){

    //get usertoken from session token
    blobLogic.convertToken(authToken, function(userToken){
        if(!userToken){
            callback({error:"session invalid"});
        }else{
            //get blob
            blobLogic.readBlob(userToken, function(blob){
                callback(blob);
            });
        }
    });
}

exports.getAuthToken = function(id, data, hash, callback){
    //.anonymousVerify with kik
    blobLogic.verify(id, data, hash, function(err, res){
        if (err){
            console.log("Verification failed due to error: " + err);
            callback(undefined);
        }else{
            if (res){
                blobLogic.makeAuthToken(id, callback);
            }else{
                console.log("Verification failed, hash invalid: " + id + "," + data + "," + hash);
                callback("Verification failed, hash invalid", undefined);
            }
        }
    });
}



