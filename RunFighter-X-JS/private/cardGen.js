var async = require('async');
var characterTiers = require('./characterTiers.js').charTiers;
var cryptoInt = require('./random.js').cryptoInt;
var uuid = require('node-uuid');
var stoneValue = 5;

exports.generateCards = function(stones, cards, callback){
    var calls = [];
    for (var i =0;i<cards;i++){
        calls.push(function(callback){
            generateCard(1, callback);
        });
    }
    async.parallel(calls, function(err, res){
        callback(err, res);
    });
}

exports.generateCard  = generateCard;
var generateCard = function(stones, callback){
    if (stones <1){
        throw "Generating a card requires at least 1 stone";
    }
    cryptoInt(100, function(err, result){
        //console.log("CryptoInt: " + result);
        if (err){
            throw err;
        }
        var tierBuckets = {
            1:100,
            2:50,
            3:10,
            4:5,
        }

        //add 5% to each tier for each stone passed in
        var maxTier = 0;
        for (var i=1;i<stones;i++){
            for(var tier in tierBuckets){
                tierBuckets[tier]+=stoneValue;
            }
        }

        for(var tier in tierBuckets){
            if (result < tierBuckets[tier]){
                if (tier > maxTier){
                    maxTier = tier;
                }
            }
        }

        var chars = characterTiers[maxTier];


        cryptoInt(chars.length-1, function(err, result){
            var card = {name:chars[result].name, id:uuid.v4()};
            callback(err, card);
        });
    });




}


