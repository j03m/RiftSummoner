var GeneralBehavior = function(sprite){
    if (!sprite){
        throw "behaviors need an owner, supply a sprite";
    }
    this.owner = sprite;
}

//init
GeneralBehavior.prototype.init = function(){
    //get reference to the layer
    this.layer = this.owner.layer;

    this.myTeam = this.layer.teams[this.owner.team];

    var opponentTeam;
    //find a team that isn't mine
    for(var potentialTeam in this.layer.teams){
        if (potentialTeam != this.owner.team){
            opponentTeam = potentialTeam;
        }
    }

    if (!opponentTeam){
        this.owner.setState('idle'); //no opponents
    }else{
        this.opponentTeam = this.layer.teams[opponentTeam];
    }
}

//find a random opposing badguy
GeneralBehavior.prototype.lockOnAny = function(){
    var sprite = jc.randomNum(0, this.opponentTeam.length-1);
    this.locked = this.opponentTeam[sprite];
    return sprite;
}