var SwitchBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.handleFight = this.handleSwitchFight;

}


SwitchBehavior.prototype.handleSwitchFight = function(dt){

    //is my target alive?
    var state= this.getState();

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['attack'];
    var damageDelay = this.owner.gameObject.effectDelays['attack'];


    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        var attackType = jc.attackStatePrefix.attack;
        if (this.locked.gameObject.hp - this.owner.gameObject.damage <= 0){
            attackType = jc.attackStatePrefix.special;
        }

        var vector = this.getVectorTo(this.owner.getBasePosition(), this.locked.getBasePosition());
        if (vector.distance > this.owner.gameObject.closeRadius){
            attackType = jc.attackStatePrefix.special; //use range
        }

        this.setAttackAnim('fighting', function(){
            var point = this.seekEnemy();
            if (!point){
                this.setState('idle', 'idle');
                return;
            }
            if (point.x != 0 || point.y != 0){
                //out of range, they fled or we got knocked back
                this.setState('move', 'move');
                return;
            }
        }.bind(this), attackType);

        if (!this.locked){
            this.setState('idle', state.anim);
            return;
        }else if (!this.locked.isAlive()){
            this.setState('idle', state.anim);
            return;
        }else{
            if (attackType == jc.attackStatePrefix.special) {
                this.owner.scheduleOnce(this.spHitLogic.bind(this), damageDelay);
            }else{
                this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
            }

        }

        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

SwitchBehavior.prototype.spHitLogic = function(){
    if (!this.locked){
        return;
    }

    //apply damage to the target
    GeneralBehavior.applyDamage(this.locked, this.owner, this.owner.gameObject.spdamage);

    //if the character in question has damageMod effects, we need to do them here
    this.damageEffects();
}