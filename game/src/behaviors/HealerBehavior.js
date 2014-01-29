var HealerBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.think = this.healThink;
    this.handleNormalMove = this.handleMove;
    this.handleMove = this.handleHealerMove;
    this.init(sprite);
}

HealerBehavior.prototype.handleHealerMove = function(dt){
    var state = this.getState();
    if (state.brain != "move" && state.brain != "followUserCommand"){
        return;
    }

    if (state.brain == "followUserCommand"){
        this.followUserCommand(dt);
        return;
    }

    if (this.support){
        this.handleHealMove(dt);
    }else{
        this.handleNormalMove(dt);
    }
}

HealerBehavior.prototype.healThink = function(dt, selected){

    var state= this.getState();
    this.handleDeath();

    if (selected){
        if (!this.forceLocked && state.brain != 'followUserCommand'){
            return;
        }
    }

    switch(state.brain){
        case 'idle':this.handleHealerIdle(dt);
            break;
//        case 'move':

        case 'fighting':this.handleFight(dt);
            break;
        case 'healing':this.handleHeal(dt);
            break;
    }

    this.afterEffects();
}


HealerBehavior.prototype.handleHealerIdle = function(dt){
    if (!this.supportLocked){
        this.support = this.getClosestFriendToSupport();
    }


    if (!this.support){
        //this.handleTankIdle(dt);
    }else{
        var point = this.getWhereIShouldBe('behind', 'facing', this.support);
        point = this.seek(point);
        if (point.x != 0 && point.y != 0){
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
    var state = this.getState();
    var point = this.getWhereIShouldBe('behind', 'facing', this.support);
    point = this.seek(point);
    if (point.x == 0 && point.y == 0){
        //arrived - heal
        this.setState('healing',state.anim );
        return;
    }

    this.moveToward(point, dt);

}

HealerBehavior.prototype.handleHeal = function(dt){

    var state= this.getState();
    if (state.anim == 'attack' || state.anim == 'special') {
        //return - let it finish
        return;
    }

    //is my target alive?
    if (!this.support){
        this.setState('idle', 'idle');
        return;
    }

    if (!this.needsAHealer(this.support) && !this.forceSupport){
        //possibly consider healing someone else
        this.handleHealerIdle(dt);
    }

    if (!this.support || !this.support.isAlive()){
        this.setState('idle', 'idle');
        return;
    }


    var point = this.getWhereIShouldBe('behind', 'facing', this.support);
    point = this.seek(point);
    if (point.x != 0 || point.y !=0){
        //arrived - heal
        this.setState('move', 'move');
        return;
    }


    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['heal'];
    var damageDelay = this.owner.gameObject.effectDelays['heal'];

    if (this.lastHeal==undefined){
        this.lastHeal = actionDelay;
    }


    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastHeal >= actionDelay && state.anim != 'attack'){
        //can heal?
        if (this.support.gameObject.hp<0 || this.support.gameObject.hp >= this.support.gameObject.MaxHP){
            this.lastHeal+=dt;
            this.setState('healing', 'idle');
        }else{
            this.owner.scheduleOnce(this.healLogic.bind(this), damageDelay);
            jc.playEffectOnTarget('heal', this.support, this.support.getZOrder(), this.owner.layer, true);
            this.lastHeal = 0;
            if (this.owner.animations['special']){
                this.setState('healing', 'special');
            }else{
                this.setState('healing', this.getAttackAnim());
          }
        }
    }else{
        this.lastHeal+=dt;
        this.setState('healing', 'idle');
    }
}