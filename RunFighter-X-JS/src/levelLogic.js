var hotr = hotr || {};
hotr.levelLogic = {};

hotr.levelLogic.getTeamForLevel = function(level){
    return hotr.blobOperations.getTeam();
}

hotr.levelLogic.getFormationForLevel = function(level){
    return "4x4x4b";
}

hotr.levelLogic.getPowers = function(){
    //todo implement me
    return ['poisonCloud', 'healing'];
}