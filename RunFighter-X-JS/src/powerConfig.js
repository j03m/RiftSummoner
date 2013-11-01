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
    "vampireRadius":function(value){

        jc.checkPower(value, "vampireRadius");

        var config = spriteDefs[value].powers["vampireRadius"];
        //get all allies in range
        var foes = this.allFoesWithinRadius(config.radius);

        //damage them and heal me this amount
        var heal = 0;
        for(var i =0;i<foes.length;i++){
            if (GeneralBehavior.applyDamage( foes[i], this.owner, config.damage)){
                jc.playEffect("greenBang", foes[i], foes[i].getZOrder(), this.owner.layer);
                heal+=config.damage;
            }
        }
        if (heal!=0){
            if (GeneralBehavior.heal(this.owner, this.owner, heal)){
                jc.playEffect("heal", this.owner, this.owner.getZOrder(), this.owner.layer);
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
    "vampireDistro":function(value){
        jc.checkPower(value, "vampireDistro");
        var config = spriteDefs[value].damageMods["vampireDistro"];
        var allies = this.owner.homeTeam;
        if (GeneralBehavior.applyDamage(this.locked, this.owner, config.damage)){
            jc.playEffect("greenBang", this.locked, this.locked.getZOrder(), this.owner.layer);
        }

        for(var i=0;i<allies.length;i++){
            if (allies[i]!= this.owner){
                if (GeneralBehavior.heal(this.owner, allies[i],config.heal)){
                    jc.playEffect("heal", allies[i], allies[i].getZOrder(), this.owner.layer);
                }

            }
        }
    },
    "vampireDrain":function(value){
        jc.checkPower(value, "vampireDrain");
        var config = spriteDefs[value].damageMods["vampireDrain"];
        if (GeneralBehavior.applyDamage(this.locked, this.owner, config.damage)){
            jc.playEffect("greenBang", this.locked, this.locked.getZOrder(), this.owner.layer);
        }

        if (GeneralBehavior.heal(this.owner, this.owner, config.heal)){
            jc.playEffect("heal", this.owner, this.owner.getZOrder(), this.owner.layer);
        }


    },
    "knockback":function(value){
        jc.checkPower(value, "knockback");
        var config = spriteDefs[value].damageMods["knockback"];
        var distance = config.distance;
        if (this.owner.isFlippedX()){
            distance*=-1;
        }
        var targetPos = this.locked.getBasePosition();
        targetPos.x+=distance;
        this.locked.setBasePosition(targetPos);
    },
    "burn":function(value){
        jc.genericPower("burn", value, this);
    },
    "burn-apply":function(effectData){
        jc.genericPowerApply(effectData, "greenBang", "burnEffect", this);
    },
    "burn-remove":function(){
        jc.genericPowerRemove("burnEffect", this);
    },
    "poison":function(value){
        jc.genericPower("poison", value, this);
    },
    "poison-apply":function(effectData){
        jc.genericPowerApply(effectData, "greenBang", "poisonEffect", this);
    },
    "poison-remove":function(){
        jc.genericPowerRemove("poisonEffect", this)
    }

}

