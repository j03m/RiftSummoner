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