//Every function in here expects to be bound to an instance of GeneralBehavior, or something that extends it!
var powerConfig = {
    "healingRadius":function(value){

        if (!spriteDefs[value] && !spriteDefs[value].powers && !spriteDefs[value].powers["healingRadius"]){
            throw "cannot find healingRadius power def for character:" + value;
        }
        var config = spriteDefs[value].powers["healingRadius"];
        //get all allies in range
        var friends = this.allFriendsWithinRadius(config.radius);

        //heal them
        for(var i =0;i<friends.length;i++){
            if (GeneralBehavior.heal(this.owner, friends[i], config.heal)){
                jc.playEffect("heal", friends[i].getPosition(), friends[i].getZOrder(), this.owner.layer);
            }
        }
    }
}