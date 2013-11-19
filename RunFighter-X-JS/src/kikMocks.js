var cards = {};
cards.kik = {};
cards.kik.getAnonymousUser = function(cb){
    cb('joeiscool1');
}

cards.kik.anonymousSign = function(value, cb){
    cb("hihihihi1", "yabbo yaboo yaboo6", "mrmgue4uandwho");
}


if (typeof module !== 'undefined' && module.exports) {
    var cardApi = {};
    cardApi.verify = function(signedData, token, host, callback){
        callback(undefined, {});
    }

    exports.cardApi = cardApi;
}
