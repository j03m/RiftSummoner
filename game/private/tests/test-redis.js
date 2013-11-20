var redis  = require("redis"),
    client = redis.createClient(), multi;

client.multi([
        ["set", "hi", "bye"],
        ["get", "hi"],
        ["expire", "hi", 120]
    ]).exec(function (err, replies) {
        console.log(replies.toString());
    });


client.get("nada", function(err, res){
    console.log(err);
    console.log(res);
    console.log(err==undefined);
    console.log(res==undefined);

});

var sessionNameSpace = "hihihih:hihihih";
var sessionToken = "hihihih:token";
var token = "blablablabla";
var sessionTTL = 24*60*60;
var sessionTTLMS = sessionTTL*1000;


//store the kik token in redis with the session token, ttl of 24hrs
client.multi([["set", sessionNameSpace+sessionToken, token],
        ["expire", sessionNameSpace+sessionToken, sessionTTL]]
    ).exec(function (err, replies) {
        if (replies[0]!="Ok" && replies[1]!=1){
            throw "Failed to set session token in Redis: " + JSON.stringify(replies);
        }else{
            console.log({token:sessionToken, expires:Date.now()+sessionTTLMS});
        }
    });