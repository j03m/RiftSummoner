var mckCards = {};
mckCards.kik = {};
mckCards.kik.getUser = function(cb){
    cb('joeiscool1');
}

mckCards.kik.sign = function(value, cb){
    cb("hihihihi1", "joeiscool1", "mrmgue4uandwho");
}


mckCards.kik.pickUsers = function(cb){
    cb();
}

mckCards.ready = function(cb){
    cb();
};

mckCards.kik.message = {
    team:[{"name":"orc"}, {"name":"elfFire"}, {"name":"shellback"}, {"name":"elfVoid"}, {"name":"goblinKnightFire"}],

    formation:"4x4x4b",
    powers:[]
};


if (!cards){
    var cards = mckCards; //auto shim in the mock
}