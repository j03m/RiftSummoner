var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.formationSize = 12;
hotr.blobTokenLocalStoreKey = "x1xBlobTokenx1x";
hotr.blobOperations.getBlob = function(callback){
    blobApi.getBlob(hotr.blobOperations.getBlobToken(),function(data){
        hotr.playerBlob = data;
        callback();
    });
}

hotr.blobOperations.getFormation = function(){
    return "4x4x4a";
}

hotr.blobOperations.getTeam = function(){
    var characterMap = {};
    _.each(hotr.playerBlob.myguys, function(character){
        characterMap[character.id] = character;
    });


    var formation = hotr.playerBlob.formation;
    var team = [formation.length];
    for (var i=0;i<formation.length; i++){
        if (formation[i]!=undefined){
            team[i]=characterMap[formation[i]];
        }
    }
    return team;

}

hotr.blobOperations.getBlobToken = function(signedData, token, host, callback){
    blobApi.getBlobToken(signedData, token, host, callback);
}

hotr.blobOperations.setBlobToken = function(token){
    sys.localStorage[hotr.blobTokenLocalStoreKey] = token;
}

hotr.blobOperations.getBlobToken = function(){
    return sys.localStorage[hotr.blobTokenLocalStoreKey];
}

hotr.blobOperations.getLevel = function(){
    //todo implement me
    return 0;
}

hotr.blobOperations.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}

hotr.blobOperations.indexToId = function(index){
    hotr.blobOperations.validate();
    return hotr.playerBlob.myguys[index].id;
}

hotr.blobOperations.getCurrentFormationPosition = function(id){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.formation){
        return -1;
    }else{
        return hotr.playerBlob.formation.indexOf(id);
    }
}

hotr.blobOperations.placeCharacterFormation = function(id, cell){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.formation){
        hotr.playerBlob.formation = [hotr.formationSize];
    }
    var index = hotr.playerBlob.formation.indexOf(id);
    if (index!=-1){
        hotr.playerBlob.formation[index]=undefined;
    }
    hotr.playerBlob.formation[cell]=id;
}

hotr.blobOperations.validate= function(){
    if (!hotr.playerBlob){
        throw "Blob not initialized, call getBlob first.";
    }
}

hotr.blobOperations.getEntryWithId = function(id){
    hotr.blobOperations.validate();
    var entry = _.find(hotr.playerBlob.myguys, function(character){
        return character.id == id;
    });

    if (!entry){
        throw "Could not locate a character with id:"+id;
    }

    return entry;
}

hotr.blobOperations.getCharacterIdsAndTypes = function(){
    hotr.blobOperations.validate();
    return hotr.playerBlob.myguys;
}

hotr.blobOperations.getCharacterNames = function(){
    hotr.blobOperations.validate();
    return _.pluck(hotr.playerBlob.myguys, 'name');
}

