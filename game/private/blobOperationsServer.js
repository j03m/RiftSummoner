var cardGen = require('./cardGen.js').generateCards;
var uuid = require('node-uuid');



exports.newPlayer = function(userId, callback){
    //make 3 cards for this player
    cardGen(1,3, function(err, res){
        var blob = {};
        blob["id"] = userId;
        blob.myguys = res;
        blob.coins = 50;
        blob.stones = 3;
        blob.version = 0;
        callback(err, blob);
    });
}


exports.uniqueToken = function(){
    return uuid.v4(); //implement me, maybe guid, maybe not sure.
}
