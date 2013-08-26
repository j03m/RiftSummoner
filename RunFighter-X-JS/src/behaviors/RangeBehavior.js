var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    //this.handleTankIdle = this.handleIdle;
    //this.handleIdle = this.handleRangeIdle;

}

RangeBehavior.prototype.handleRangeIdle = function(dt){
    //find a tank team mate's target
    this.locked = this.getClosestTankFriendTarget();
    if (this.locked){
        this.setState('move', 'move');
    }else{
        //if none, act like a tank
        this.handleTankIdle(dt);
    }
}

//todo: Override damage here, damage should be off of projectile
RangeBehavior.prototype.handleFight = function(dt){

    //is my target alive?
    if (!this.locked.isAlive()){
        this.setState('idle', 'idle');
        return;
    }

    var state= this.getState();
    var targetState = this.locked.getState();
    if (targetState.brain == 'flee'){
        //he's running away - follow
        this.setState('move', 'move');
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['attack'];
    var damageDelay = this.owner.gameObject.effectDelays['attack'];
    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim != 'attack'){
        this.setState(undefined, 'attack');
        this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}












