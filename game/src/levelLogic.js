var hotr = hotr || {};
hotr.levelLogic = {};




hotr.levelLogic.getTeamForLevel = function(level){
    var baddies = questLevels[level];
    if (baddies){
        return baddies;
    }else{
        return hotr.makeRandomTeam();
    }


}

hotr.levelLogic.getFormationForLevel = function(level){
    return "4x4x4b";
}

hotr.levelLogic.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}
hotr.makeRandomTeam =  function makeRandomTeam(){
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
        team.push({name:myname, id:i+1});
    }
    return team;
}