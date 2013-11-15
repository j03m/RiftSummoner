var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.playerBlob = {
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


hotr.blobOperations.getEntryWithId = function(id){
    var entry = _.find(hotr.playerBlob.myguys, function(character){
        return character.id == id;
    });

    if (!entry){
        throw "Could not locate a character with id:"+id;
    }

    return entry;
}

hotr.blobOperations.getCharacterIdsAndTypes = function(){
    return hotr.playerBlob.myguys;
}

hotr.blobOperations.getCharacterNames = function(){
    return _.pluck(hotr.playerBlob.myguys, 'name');
}

