var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.formationSize = 12;
hotr.authTokenLocalStoreKey = "x1xauthTokenx1x";
hotr.haveSeenLocalStoreKey = "x1xhaveseenx1x";
hotr.blobOperations.getBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    blobApi.getBlob(authToken.token,function(err, data){
        hotr.playerBlob = data;
        callback();
    });
}

hotr.blobOperations.saveBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    hotr.playerBlob.version++;
    blobApi.saveBlob(authToken.token, hotr.playerBlob, function(err, res){
        callback(err, res);
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

hotr.blobOperations.createNewPlayer = function(signedData, userToken, host, callback){
    blobApi.createNewPlayer(signedData, userToken, host, function(blob, token){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(token);
        hotr.blobOperations.setHasPlayed();
        callback();
    });
}

hotr.blobOperations.getNewAuthTokenAndBlob = function(signedData, userToken, host, callback){
    blobApi.getNewAuthTokenAndBlob(signedData, userToken, host, function(){
        hotr.playerBlob = blob;
        hotr.setAuthToken(token);
        callback();
    });
}



hotr.blobOperations.getNewAuthToken = function(signedData, userToken, host, callback){
    blobApi.getAuthToken(signedData, userToken, host, callback);
}

hotr.blobOperations.setAuthToken = function(token){
    jc.setLocalStorage(hotr.authTokenLocalStoreKey, token);
}

hotr.blobOperations.getCachedAuthToken = function(){
    return jc.getLocalStorage(hotr.authTokenLocalStoreKey);
}

hotr.blobOperations.hasToken = function(){
    var token = hotr.blobOperations.getCachedAuthToken();
    if (!token){
        return false;
    }
    if (token.expires - Date.now() < 0){
        return false; //token expired
    }
}


hotr.blobOperations.hasPlayed = function(){
    return jc.getLocalStorage(hotr.haveSeenLocalStoreKey)!=undefined;
}

hotr.blobOperations.setHasPlayed=function(){
    jc.setLocalStorage(hotr.haveSeenLocalStoreKey, {"haveSeenMe":true});
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

hotr.blobOperations.getFormationOrder = function(){
    hotr.blobOperations.validate();
    return hotr.playerBlob.formation;
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

