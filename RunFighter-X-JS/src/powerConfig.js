//Every function in here expects to be bound to an instance of GeneralBehavior, or something that extends it!
var powerConfig = {
    "healingRadius":function(value){

        jc.checkPower(value, "healingRadius");

        var config = spriteDefs[value].powers["healingRadius"];
        //get all allies in range
        var friends = this.allFriendsWithinRadius(config.radius);

        //heal them
        for(var i =0;i<friends.length;i++){
            if (GeneralBehavior.heal(this.owner, friends[i], config.heal)){
                jc.playEffect("heal", friends[i], friends[i].getZOrder(), this.owner.layer);
            }
        }
    },
    "regeneration":function(value){
        jc.checkPower(value, "regeneration");
        var config = spriteDefs[value].powers["regeneration"];
        if (GeneralBehavior.heal(this.owner, this.owner, config.heal)){
            jc.playEffect("heal", this.owner, this.owner.getZOrder(), this.owner.layer);
        }
    },
    "splashDamage":function(value){
        jc.checkPower(value, "splashDamage");
        var config = spriteDefs[value].damageMods["splashDamage"];
        var foes = this.allFoesWithinRadiusOfPoint(config.radius, this.locked.getBasePosition());
        //damage them
        for(var i=0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage(foes[i], this.owner, config.damage)){
                jc.playEffect("greenBang", foes[i], foes[i].getZOrder(), this.owner.layer);
            }
        }
    },
    "burn":function(value){
        jc.checkPower(value, "burn");
        var config = spriteDefs[value].damageMods["burn"];
        var effect = {};
        effect = _.extend(effect, config); //add all props in config to effect
        effect.name = "burn";
        effect.origin = this.owner;
        this.locked.addEffect(effect);
    },
    "burn-apply":function(effectData){
        //examine the effect config and apply burning to the victim
        if (GeneralBehavior.applyDamage(this.owner, effectData.origin, effectData.damage)){
            if (!this.owner.burnEffect){
                this.owner.burnEffect = jc.playEffect("greenBang", this.owner, this.owner.getZOrder(), this.owner.layer);
            }
        }
    },
    "burn-remove":function(effectData){
        if (!this.owner.burnEffect){
            this.owner.layer.removeChild(this.owner.burnEffect);
        }
        this.owner.burnEffect = undefined;
    }

}

