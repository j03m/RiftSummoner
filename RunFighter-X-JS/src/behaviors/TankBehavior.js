var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.stateMap
}

TankBehavior.prototype.think = function(dt){
    //todo remove this:
    if (this.owner.isAlive()){
        this.handleState(dt);
    }
}

TankBehavior.prototype.handleState = function(dt){
    var state= this.getState();
    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'move':this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
    }
}

TankBehavior.prototype.handleFight = function(dt){

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

TankBehavior.prototype.handleIdle = function(dt){
    //if I'm idle, lock on
    this.locked = this.lockOnClosestUnlocked();
    if (this.locked){
        this.setState('move', 'move');
    }
    //otherwise you need to just chill
}

TankBehavior.prototype.handleMove = function(dt){
    var point = this.seekEnemy();
    if (point.x == 0 && point.y == 0){
        //arrived - attack
        this.setState('fighting');
    }
    this.moveToward(point, dt);
}

//TankBehavior.prototype.think = function(dt){
//
//    //if I'm not locked on, lock on
//    if (this.state() == 'dead' || !this.owner.isAlive()){
//        return;
//    }
//
//    if  (this.state() == 'attack'){ //todo: replace with isAttacking to cover all possible attack states
//        //let attack finish
//        return;
//    }
//
//    if (!this.locked || !this.locked.isAlive()){
//        this.locked = this.lockOnClosestUnlocked();
//        if (!this.locked){
//            this.locked = this.lockOnClosest();
//        }
//        this.setState('idle', 'idle');
//        if (!this.locked){
//            return;
//        }
//
//    }
//
//    if (this.state() == 'idle' || this.state() == 'move'){
//        //set state to moving
//        //update our sprites animation to move
//        this.setState('move', 'move');
//
//        var point = this.seekEnemy();  //todo: if seek is 0,0 - attack
//        if (point.x==0 && point.y==0){
//            this.doAttack();
//        }else{
//            this.moveToward(point, dt);
//
//
//            //modify landing so that if two sprites are lock on each other, they do a sort of square off.
//
//            //if the sprite im locked onto is locked squared on someone else, find open space in what we'll call the attack radius
//
//            //attack radius is a place where i am visible and not in anyone elses bounding box
//
//
//
//        }
//    }
//}







