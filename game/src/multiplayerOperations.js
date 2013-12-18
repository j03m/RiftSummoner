var hotr = hotr || {};
hotr.multiplayerOperations = {};

hotr.multiplayerOperations.getGames = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken();
    hotr.api.getGames(authToken.token,function(err, data){
        if (data != undefined){
            hotr.multiplayerData = data;
        }else{
            hotr.multiplayerData = undefined; //no games        	
        }
		callback();
    });
}

hotr.multiplayerOperations.getTeam = function(op, callback){
    var authToken = hotr.blobOperations.getCachedAuthToken();	
	hotr.api.getTeam(authToken.token, op, callback);
}

hotr.multiplayerOperations.findGame = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    hotr.api.findGame(authToken.token,function(err, data){
        if (data != undefined){
            hotr.newOpponent = data;
            callback(true);
        }else{
            callback(false);
        }
    });
}
