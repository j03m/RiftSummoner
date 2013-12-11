var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.formationSize = 12;
hotr.authTokenLocalStoreKey = "x1xauthTokenx1x";
hotr.haveSeenLocalStoreKey = "x1xhaveseenx1x";
hotr.userNameKey = "x1xusernamex1x";
hotr.credsKey = "x1xcredsx1x";

//check for web vs native
if (typeof blobApi !== 'undefined') {
    if (!jc.blobApi){
        jc.blobApi = blobApi;
    }
}

makeGuid = function(){
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
    });

}

makeSig = function(creds){
    //make random data
    var random = makeGuid();
    //append password to it
    var random2 = creds.pass + random;

    //md5 it
    var hash = md5(random2);
    return {
          "data":random,
          "hash":hash,
    };
}

hotr.blobOperations.getCreds = function(){
    return jc.getLocalStorage(hotr.credsKey);
}

hotr.blobOperations.generateCreds = function(){
    var creds = {};
    creds.id = makeGuid();
    creds.pass = makeGuid();
    jc.setLocalStorage(hotr.credsKey, creds);
    return creds;
}



hotr.blobOperations.getBlob = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    jc.blobApi.getBlob(authToken.token,function(data){
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
    jc.blobApi.saveBlob(authToken.token, hotr.playerBlob, function(res){
        callback(res);
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

hotr.blobOperations.createNewPlayer = function(callback){
    var creds = hotr.blobOperations.generateCreds();
    jc.blobApi.createNewPlayer(creds.id, creds.pass, function(blob, token){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(token);
        hotr.blobOperations.setHasPlayed();
        callback();
    });
}

hotr.blobOperations.getNewAuthTokenAndBlob = function(callback){
    var creds = hotr.blobOperations.getCreds();
    var sig = makeSig(creds);
    jc.blobApi.getNewAuthTokenAndBlob(creds.id, sig.data, sig.hash, function(authToken, blob){
        hotr.playerBlob = blob;
        hotr.blobOperations.setAuthToken(authToken);
        callback();
    });
}


hotr.blobOperations.getNewAuthToken = function(callback){
    var creds = hotr.blobOperations.getCreds();
    var sig = makeSig(creds);
    jc.blobApi.getAuthToken(creds.id, sig.data, sig.hash, callback);
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

