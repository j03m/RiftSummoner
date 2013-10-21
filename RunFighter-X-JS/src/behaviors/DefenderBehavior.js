var DefenderBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleDefenderIdle;
    this.think = this.defendThink;
}

//Find a support or range to defend

//follow

//attack anyone how comes in attack radius

DefenderBehavior.prototype.handleSeek = function(dt){

    //glade would not approve :(
    if (this.support && this.support.behavior.damager && this.support.behavior.damager.isAlive()){
        this.locked = this.support.behavior.damager;
        this.setState('attackmove', 'move');
        return;
    }

    this.locked = this.lockOnEnemyInRadius();
    if (this.locked){
        this.setState('attackmove','move');
        return;
    }

    if (this.support){
        if(!this.targetWithinSeekRadius(this.support)){
            this.setState('move', 'move');
        }
    }


}

DefenderBehavior.prototype.handleDefenderMove = function(dt){
    var point = this.getWhereIShouldBe('front', 'away', this.support);
    point = this.seek(point);
    if (point.x == 0 && point.y == 0){
        this.setState('seek', 'idle');
        return;
    }
    this.setState('idle', 'move');
    this.moveToward(point, dt);
}



DefenderBehavior.prototype.handleDefenderDamage = function(dt){
    if (this.damager && this.damager.isAlive() && this.damager != this.locked && this.isNot(['range', 'mage'], this.damager)){
        this.locked = this.damager;
        this.setState('attackmove', 'move');
    }else{
        this.resume();
    }
}

DefenderBehavior.prototype.defendThink = function(dt){

    var state= this.getState();
    if (!this.owner.isAlive() && state.brain!='dead'){
        this.setState('dead','dead');
        return;
    }

    switch(state.brain){
        case 'idle':this.handleDefenderIdle(dt);
            break;
        case 'move':
            this.handleDefenderMove(dt);
            break;
        case 'attackmove':
            this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'seek':this.handleSeek(dt);
            break;
        case 'damage':this.handleDefenderDamage(dt);
            break;
    }
}

DefenderBehavior.prototype.handleDefenderIdle = function(dt){
    if (!this.support){
        this.support = this.lockOnClosestFriendlyNonTank();
    }

    if (!this.support || !this.support.isAlive()){
        this.support = undefined;
        this.locked = this.lockOnClosestFriendlyNonTank();
    }


    if (!this.support){
        this.handleTankIdle(dt);
    }else{
        this.setState('move', 'move');
    }
}