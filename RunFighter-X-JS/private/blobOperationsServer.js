var cardGen = require('cardGen.js').generateCards;


var tempBlob = {
    id:1,
    myguys:[
        {
            "name":"orge",
            "id":"id1",
            "data":{}
        },
        {
            "name":"goblin",
            "id":"id2",
            "data":{}
        },
        {
            "name":"goblinKnightBlood",
            "id":"id3",
            "data":{}
        },
        {
            "name":"orge",
            "id":"id4",
            "data":{}
        },
        {
            "name":"goblin",
            "id":"id5",
            "data":{}
        },
        {
            "name":"goblinKnightBlood",
            "id":"id6",
            "data":{}
        },
        {
            "name":"orge",
            "id":"id7",
            "data":{}
        },
        {
            "name":"goblin",
            "id":"id8",
            "data":{}
        },
        {
            "name":"goblinKnightBlood",
            "id":"id9",
            "data":{}
        }
    ],
    "coins":100,
    "stones":5
}

exports.newPlayer = function(userId, callback){
    //make 3 cards for this player
    cardGen(1,3, function(err, res){
        var blob = {};
        blob["id"] = userId;
        blob.myguys = res;
        blob.coins = 50;
        blob.stones = 3;
        callback(err, blob);
    });
}

