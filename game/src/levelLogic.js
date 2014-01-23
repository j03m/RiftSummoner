var hotr = hotr || {};
hotr.levelLogic = {};


hotr.levelLogic.getTeamForLevel = function(level){


    var baddies = questLevels["4"];
    return baddies;
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

hotr.randomCard = function randomCard(){
    var allChars = hotr.getAllCards();
    Math.seedrandom(Date.now());
    var val = Math.floor((Math.random()*allChars.length-1)+1);
    var myname = allChars[val];
    return myname;
}

hotr.makeRandomTeam =  function makeRandomTeam(){
    var characters = jc.teamSize;
    Math.seedrandom(Date.now());
    var allChars = hotr.getAllCards();
    var team = [];
    for(var i =0;i<characters;i++){
        var val = Math.floor((Math.random()*allChars.length-1)+1);
        var myname = allChars[val];
        console.log("random char:" + myname + val);
        team.push({name:myname, id:i+1});
    }
    return team;
}

hotr.getAllCards = function getAllCards(){
    var allChars = [];
    for(var entry in spriteDefs){
        if (!spriteDefs[entry].parentOnly && spriteDefs[entry].notplayable!=1){
            allChars.push(entry);
        }
    }
    return allChars;
}