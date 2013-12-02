var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.formationSize = 12;
hotr.authTokenLocalStoreKey = "x1xauthTokenx1x";
hotr.haveSeenLocalStoreKey = "x1xhaveseenx1x";
hotr.userNameKey = "x1xusernamex1x";
hotr.blobOperations.getBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    blobApi.getBlob(authToken.token,function(err, data){
        if (data != undefined){
            hotr.playerBlob = data;
            callback(true);
        }else{
            callback(false);
        }
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
    var team = [];
    for (var i=0;i<formation.length; i++){
        if (formation[i]!=undefined){
            if (characterMap[formation[i]]){       //no invalid ids
                team[i]=characterMap[formation[i]];
            }

        }
    }
    return team;
}

hotr.blobOperations.createNewPlayer = function(signedData, userToken, host,  callback){
    blobApi.createNewPlayer(signedData, userToken, host, function(blob, token){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(token);
        hotr.blobOperations.setHasPlayed();
        hotr.blobOperations.setUserName(userToken);
        callback();
    });
}

hotr.blobOperations.getNewAuthTokenAndBlob = function(signedData, userToken, host, callback){
    blobApi.getNewAuthTokenAndBlob(signedData, userToken, host, function(authToken, blob){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(authToken);
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
    return true;
}

hotr.blobOperations.getUserName = function(){
    return jc.getLocalStorage(hotr.userNameKey);
}

hotr.blobOperations.setUserName = function(username){
    return jc.setLocalStorage(hotr.userNameKey,username);
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
    if (hotr.playerBlob.myguys[index]){
        return hotr.playerBlob.myguys[index].id;
    }else{
        return undefined;
    }

}

hotr.blobOperations.getFormationOrder = function(){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.formation){
        hotr.playerBlob.formation=[];
    }
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

hotr.blobOperations.clearFormationPosition = function(cell){
    hotr.playerBlob.formation[cell]=undefined;
}

hotr.blobOperations.placeCharacterFormation = function(id, cell){
    hotr.blobOperations.validate();
    var characterMap = {};
    _.each(hotr.playerBlob.myguys, function(character){
        characterMap[character.id] = character;
    });

    if (!hotr.playerBlob.formation){
        hotr.playerBlob.formation = [];
    }
    var index = hotr.playerBlob.formation.indexOf(id);
    if (index!=-1){
        hotr.playerBlob.formation[index]=undefined;
    }
    if (characterMap[id]){ //no illegal ids
        hotr.playerBlob.formation[cell]=id;
    }else{
        throw "Id: " + id + " not valid for player";
    }

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

