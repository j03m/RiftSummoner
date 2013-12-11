var hotr = hotr || {};
hotr.multiplayerOperations = {};

//check for web vs native
if (typeof multiplayerApi !== 'undefined') {
    if (!jc.multiplayerApi){
        jc.multiplayerApi = multiplayerApi;
    }
}

hotr.multiplayerOperations.getGames = function(callback){
    var authToken = hotr.blobOperations.getCachedAuthToken()
    jc.multiplayerApi.getGames(authToken.token,function(err, data){
        if (data != undefined){
            hotr.multiplayerData = data;
            callback(true);
        }else{
            callback(false);
        }
    });
}
