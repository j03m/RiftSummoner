var hotr = hotr || {};
hotr.levelLogic = {};

var temp =  [
    {
        "name":"orge",
        "id":"id1",
        "data":{}
    },
    {
        "name":"blueKnight",
        "id":"id2",
        "data":{}
    },
    {
        "name":"wizard",
        "id":"id3",
        "data":{}
    },
    {
        "name":"dwarvenKnightWater",
        "id":"id4",
        "data":{}
    },
    {
        "name":"dwarvenKnightEarth",
        "id":"id5",
        "data":{}
    },
    {
        "name":"goblinKnightNormal",
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