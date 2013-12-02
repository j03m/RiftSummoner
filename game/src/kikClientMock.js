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
var temp =  [
    {
        "name":"ogre",
        "id":"id1",
        "data":{}
    },
    {
        "name":"ogre",
        "id":"id2",
        "data":{}
    },
    {
        "name":"ogre",
        "id":"id3",
        "data":{}
    },
    {
        "name":"ogre",
        "id":"id4",
        "data":{}
    },
    {
        "name":"orc",
        "id":"id5",
        "data":{}
    },
    {
        "name":"goblin",
        "data":{}
    },
    {
        "name":"goblin",
        "data":{}
    },
    {
        "name":"orc",
        "data":{}
    },
    {
        "name":"wizard",
        "data":{}
    },
    {
        "name":"wizard",
        "data":{}
    },
    {
        "name":"wizard",
        "data":{}
    },
    {
        "name":"wizard",
        "data":{}
    }
]
mckCards.kik.message = {
    team:temp,
    formation:"4x4x4b",
    powers:[]
};


if (!cards){
    var cards = mckCards; //auto shim in the mock
}