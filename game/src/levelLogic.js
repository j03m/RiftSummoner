var hotr = hotr || {};
hotr.levelLogic = {};

//var temp =  [
//    {
//        "name":"ogre",
//        "id":"id1",
//        "data":{}
//    },
//    {
//        "name":"ogre",
//        "id":"id2",
//        "data":{}
//    },
//    {
//        "name":"ogre",
//        "id":"id3",
//        "data":{}
//    },
//    {
//        "name":"ogre",
//        "id":"id4",
//        "data":{}
//    },
//    {
//        "name":"orc",
//        "id":"id5",
//        "data":{}
//    },
//    {
//        "name":"goblin",
//        "data":{}
//    },
//    {
//        "name":"goblin",
//        "data":{}
//    },
//    {
//        "name":"orc",
//        "data":{}
//    },
//    {
//        "name":"wizard",
//        "data":{}
//    },
//    {
//        "name":"wizard",
//        "data":{}
//    },
//    {
//        "name":"wizard",
//        "data":{}
//    },
//    {
//        "name":"wizard",
//        "data":{}
//    }
//]

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

hotr.levelLogic.getTeamForLevel = function(level){
    return temp;
}

hotr.levelLogic.getFormationForLevel = function(level){
    return "4x4x4b";
}

hotr.levelLogic.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}