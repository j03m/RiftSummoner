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


exports.getBlob = function(callback){

    //does my userid exist?



    console.log("Call made");
    console.log(JSON.stringify(tempBlob));
    callback(tempBlob);
}