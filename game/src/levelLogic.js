var hotr = hotr || {};
hotr.levelLogic = {};

var temp =  [
    {
        "name":"goblinKnightNormal",
        "id":"id1",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id2",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id3",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
        "id":"id4",
        "data":{}
    },
    {
        "name":"spider",
        "id":"id5",
        "data":{}
    },
    {
        "name":"wizard",
        "data":{}
    }]



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