exports.saveBlob =  function(callback){
    callback('Hello from Zerver');
}


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
        }
    ],
    "coins":100,
    "stones":5
}

exports.getBlob = function(callback){
    callback(tempBlob);
}