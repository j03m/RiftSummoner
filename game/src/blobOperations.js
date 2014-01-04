var hotr = hotr || {};
hotr.blobOperations = {};
hotr.scratchBoard = {};
hotr.teamformationSize = 18;
hotr.authTokenLocalStoreKey = "x1xauthTokenx1x";
hotr.haveSeenLocalStoreKey = "x1xhaveseenx1x";
hotr.userNameKey = "x1xusernamex1x";
hotr.credsKey = "x1xcredsx1x";


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
    var random2 = random + creds.pass;

    //md5 it
    var hash = md5(random2);
    return {
          "data":random,
          "hash":hash
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
    hotr.api.getBlob(authToken.token,function(err, data){
		if (err){
			throw err;
		}
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
    hotr.api.saveBlob(authToken.token, hotr.playerBlob, function(err,res){
		if (err){
			throw err;
		}
        if (callback){
            callback(res);
        }

    });
}

hotr.blobOperations.getFormation = function(){
    return "4x4x4a";
}

hotr.blobOperations.getTeam = function(){
    jc.log(['bloboperations'], 'getteam');
    var characterMap = {};
    jc.log(['bloboperations'], 'characterMap');
    _.each(hotr.playerBlob.myguys, function(character){
        jc.log(['bloboperations'], 'characterMap:' + character.name);
        characterMap[character.id] = character;
    });

    jc.log(['bloboperations'], 'teamformation');
    if (!hotr.playerBlob.teamformation){
        hotr.playerBlob.teamformation = [];
    }

    var formation = hotr.playerBlob.teamformation;
    var team = [];
    jc.log(['bloboperations'], 'team loop');

    for (var i=0;i<formation.length; i++){
        if (formation[i]!=undefined){

            if (characterMap[formation[i]]){       //no invalid ids
                team[i]=characterMap[formation[i]];
            }

        }
    }
    jc.log(['bloboperations'], 'return');
    return team;
}

hotr.blobOperations.createNewPlayer = function(callback){
    var creds = hotr.blobOperations.generateCreds();
    hotr.api.createNewPlayer(creds.id, creds.pass, function(err, res){
		if (err){
			throw err;
		}
        hotr.playerBlob = res.blob;
        hotr.blobOperations.setAuthToken(res.token);
        hotr.blobOperations.setHasPlayed();
        callback();
    });
}

hotr.blobOperations.getNewAuthTokenAndBlob = function(callback){
    var creds = hotr.blobOperations.getCreds();
    var sig = makeSig(creds);
    hotr.api.getNewAuthTokenAndBlob(creds.id, sig.data, sig.hash, function(err, res){
		if (err){
			throw err;
		}
		if (!res.blob){
			throw "getNewAuthTokenAndBlob failed to provide blob";
		}
        hotr.playerBlob = res.blob;
        hotr.blobOperations.setAuthToken(res.token);
        callback();
    });
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
    if(!hotr.playerBlob.questLevel){
        hotr.playerBlob.questLevel=0;
    }

    return hotr.playerBlob.questLevel;
}

hotr.inMultiplayer = 0; //until it's set otherwise, disables tutorial steps

hotr.blobOperations.getTutorialLevel = function(){
    //todo implement me
    if (hotr.inMultiplayer){
        return -1;
    }

    if(!hotr.playerBlob.questLevel){
        hotr.playerBlob.questLevel=1;
    }

    return hotr.playerBlob.questLevel;
}

hotr.blobOperations.getTutorialStep= function(){
    if (!hotr.playerBlob.tutortialStep){
        hotr.playerBlob.tutortialStep=1;
    }
    return hotr.playerBlob.tutortialStep;
}

hotr.blobOperations.setTutorialStep= function(val){
    hotr.playerBlob.tutortialStep = val;
}

hotr.blobOperations.incrementLevel = function(){
    if(!hotr.playerBlob.questLevel){
        hotr.playerBlob.questLevel=0;
    }
    hotr.playerBlob.questLevel++;
}

hotr.blobOperations.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'cannon'];
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
    if (!hotr.playerBlob.teamformation){
        hotr.playerBlob.teamformation=[];
    }
    return hotr.playerBlob.teamformation;
}

hotr.blobOperations.getCurrentFormationPosition = function(id){
    hotr.blobOperations.validate();
    if (!hotr.playerBlob.teamformation){
        return -1;
    }else{
        return hotr.playerBlob.teamformation.indexOf(id);
    }
}

hotr.blobOperations.clearFormationPosition = function(cell){
    hotr.playerBlob.teamformation[cell]=undefined;
}

hotr.blobOperations.setSquadLocations = function(squad, point){
    if (!hotr.playerBlob.squadPositions){
        hotr.playerBlob.squadPositions = {};
    }

    hotr.playerBlob.squadPositions[squad]=point;
}

hotr.blobOperations.placeCharacterFormation = function(id, cell){
    hotr.blobOperations.validate();
    var characterMap = {};
    _.each(hotr.playerBlob.myguys, function(character){
        characterMap[character.id] = character;
    });

    if (!hotr.playerBlob.teamformation){
        hotr.playerBlob.teamformation = [];
    }
    var index = hotr.playerBlob.teamformation.indexOf(id);
    if (index!=-1){
        hotr.playerBlob.teamformation[index]=undefined;
    }
    if (characterMap[id]){ //no illegal ids
        hotr.playerBlob.teamformation[cell]=id;
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

