var HealerBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.think = this.healThink;
    this.init(sprite);
}


HealerBehavior.prototype.healThink = function(dt){

    var state= this.getState();
    this.handleDeath();

    switch(state.brain){
        case 'idle':this.handleHealerIdle(dt);
            break;
        case 'move':
            if (this.support){
                this.handleHealMove(dt);
            }else{
                this.handleMove(dt);
            }
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'healing':this.handleHeal(dt);
            break;
        case 'damage':this.handleDamage(dt);
            break;
    }

    this.afterEffects();
}


HealerBehavior.prototype.handleHealerIdle = function(dt){
    if (!this.support || !this.support.isAlive()){
        this.support = this.getClosestFriendToSupport();
    }

    if (!this.support){
        this.handleTankIdle(dt);
    }else{
        //get close
        if(!this.withinThisRadius(this.support.getBasePosition(), this.owner.getTargetRadius()*2, this.owner.getTargetRadiusY()/2)){
            this.setState('move', 'move');
            return;
        }

        if (this.support.gameObject.hp>0 && this.support.gameObject.hp < this.support.gameObject.MaxHP){
            //needs a heal.
            var state = this.getState();
            this.setState('healing', 'attack');
        }

    }
}


HealerBehavior.prototype.handleHealMove = function(dt){
    var point = this.getWhereIShouldBe('behind', 'facing', this.support);
    point = this.seek(point);
    if (point.x == 0 && point.y == 0){
        //arrived - heal
        this.setState('healing', 'idle');
        return;
    }

    this.setState('move', 'move');
    this.moveToward(point, dt);

}

HealerBehavior.prototype.handleHeal = function(dt){

    var state= this.getState();
    if (state.anim == 'attack'){
        //return - let it finish
        return;
    }

    //is my target alive?
    if (!this.support){
        this.setState('idle', 'idle');
        return;
    }

    if (!this.support.isAlive()){
        this.setState('idle', 'idle');
        return;
    }

    if (this.support.gameObject.hp >= this.support.gameObject.MaxHP){
        //does not needs a heal.
        this.setState('idle', 'idle');
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['heal'];
    var damageDelay = this.owner.gameObject.effectDelays['heal'];

    if (this.lastHeal==undefined){
        this.lastHeal = actionDelay;
    }


    //can heal?
    if (this.support.gameObject.hp<0 || this.support.gameObject.hp >= this.support.gameObject.MaxHP){
        this.setState('idle', 'idle');
        this.lastHeal+=dt;
        return;
    }


    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastHeal >= actionDelay && state.anim != 'attack'){
        this.owner.scheduleOnce(this.healLogic.bind(this), damageDelay);
        this.setState('healing', 'attack');
        this.lastHeal = 0;
    }else{
        this.lastHeal+=dt;
        this.setState('healing', state.anim);

    }
}