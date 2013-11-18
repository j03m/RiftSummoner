var cards = require('kik-cards');
var blobStorage = require('../private/blobOperationsServer.js');

//todo: update to use ring + pass off read failures
var redis = require("redis"),
    client = redis.createClient();

var sessionTTL = 24*60*60;
var sessionNameSpace = "hotr:session:";
var blobNameSpace = "hotr:blob:";


exports.saveBlob =  function(callback){
    callback('Hello from Zerver');
}

exports.getBlob = function(token, callback){

    //get usertoken from session token
    client.get(sessionNameSpace+token, function(err, res){
        if (err){
            throw err;
        }

        var userToken = res;

        if (userToken==undefined){
            throw "No user for session: " + token + " found.";
        }else{
            //get blob
            client.get(blobNameSpace+userToken, function(err, res){
                if (res == undefined){
                    //create a blob and signal to the client that this is a new blob
                    blobStorage.newPlayer(function(err, res){
                        //todo: handle errors at this level, review zerver for how to handle errors
                        callback(err, res);
                    });
                }
            });
        }
    });
}

exports.getBlobToken = function(signedData, token, host, callback){
    //verify with kik
    cards.verify(signedData, token, host, function(err, res){
        if (err){
            throw "Kik verification failed: " + err;
        }else{
            //if cool generate a session token
            var sessionToken = uniqueToken();

            //store the kik token in redis with the session token, ttl of 24hrs
            client.multi([["set", sessionNameSpace+sessionToken, token],
                         ["expire", sessionNameSpace+sessionToken, sessionTTL]]
            ).exec(function (replies) {
                if (replies[0]!="Ok" && replies[1]!=1){
                    throw "Failed to set session token in Redis: " + JSON.stringify(replies);
                }else{
                    callback(sessionToken);
                }
            });
        }
    });
}

function uniqueToken(){
    return "foo"; //implement me, maybe guid, maybe not sure.
}