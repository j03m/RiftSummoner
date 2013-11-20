var cards = {};
cards.kik = {};
cards.kik.getAnonymousUser = function(cb){
    cb('joeiscool1');
}

cards.kik.anonymousSign = function(value, cb){
    cb("hihihihi1", "yabbo yaboo yaboo6", "mrmgue4uandwho");
}


cards.ready = function(cb){
    window.load = cb;
}