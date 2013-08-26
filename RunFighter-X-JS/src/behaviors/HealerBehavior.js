var HealerBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.think = this.healThink;
    this.init(sprite);
}


HealerBehavior.prototype.healThink = function(dt){

    var state= this.getState();
    if (!this.owner.isAlive() && state.brain!='dead'){
        this.setState('dead','dead');
        return;
    }

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
}


HealerBehavior.prototype.handleHealerIdle = function(dt){
    this.support = this.getClosestFriendToSupport();
    if (!this.support){
        this.handleTankIdle(dt);
    }else{
        this.setState('move','idle');
    }
}

HealerBehavior.prototype.handleHealMove = function(dt){
    var point = this.seek(this.support.getBasePosition());
    if (point.x == 0 && point.y == 0){
        //arrived - heal
        this.setState('healing');
        return;
    }
    this.setState('move', 'move');
    this.moveToward(point, dt);


}

HealerBehavior.prototype.handleHeal = function(dt){

    //is my target alive?
    if (!this.support){
        this.setState('idle', 'idle');
        return;
    }

    if (!this.support.isAlive()){
        this.setState('idle', 'idle');
        return;
    }

    //can heal?
    if (this.support.gameObject.hp<0 || this.support.gameObject.hp == this.support.gameObject.MaxHP){
        this.setState('healing', 'idle');
        return;
    }

    var state= this.getState();

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['heal'];
    var damageDelay = this.owner.gameObject.effectDelays['heal'];
    if (this.lastHeal==undefined){
        this.lastHeal = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastHeal >= actionDelay && state.anim != 'attack'){
        this.setState(undefined, 'attack');
        this.owner.scheduleOnce(this.healLogic.bind(this), damageDelay);
        this.lastHeal = 0;
    }else{
        this.lastHeal+=dt;
    }
}