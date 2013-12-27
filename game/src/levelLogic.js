var hotr = hotr || {};
hotr.levelLogic = {};



var temp =  [
    {
        "name":"dwarvenKnightFire",
        "id":"id1",
        "data":{}
    },
    {
        "name":"elementalEarth",
        "id":"id2",
        "data":{}
    },
    {
        "name":"dragonFire",
        "id":"id2",
        "data":{}
    },
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
//        "name":"orc",
//        "data":{}
//    },
//    {
//        "name":"orc",
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
//    }
]

hotr.levelLogic.getTeamForLevel = function(level){
    return temp;
    //return makeRandomTeam();
}

hotr.levelLogic.getFormationForLevel = function(level){
    return "4x4x4b";
}

hotr.levelLogic.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}

function makeRandomTeam(){
//    var characters = Math.floor((Math.random()*48-1)+1);
//    if (characters>12){
//        characters = 12;
//    }

    var characters = 18;
    var allChars = [];
    for(var entry in spriteDefs){
        if (!spriteDefs[entry].parentOnly){
            allChars.push(entry);
        }

    }
    var team = [];
    for(var i =0;i<characters;i++){
        var val = Math.floor((Math.random()*allChars.length-1)+1);
        var myname = allChars[val];
        console.log("random char:" + myname + val);
        team.push({name:myname});
    }
    return team;
}