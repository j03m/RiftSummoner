


var GeneralBehavior = cc.Node.extend({});


GeneralBehavior.prototype.getState = function(){
    //some behaviors have aiStates, which are in addition to sprite states, this is shitty. I know this.
    if (!this.brainState){
        this.setState('idle');
    }

    if (!this.animationState){
        this.owner.setState('idle');
    }
    return {brain:this.brainState, anim:this.animationState};
}

GeneralBehavior.prototype.resume = function(){
    this.setState(this.lastBrain, this.lastAnim);
}

//sets a state
GeneralBehavior.prototype.setState = function(brainState, animationState){
    this.lastBrain = this.brainState;
    this.lastAnim = this.animationState;
    if (brainState){
        this.brainState = brainState;
    }
    if (animationState){
        this.animationState = animationState;
        this.owner.setState(this.animationState, function(newState){
            this.animationState = newState;
            this.owner.setState(this.animationState);
        }.bind(this));
    }
}




//init
GeneralBehavior.prototype.init = function(sprite){
    this.owner = sprite;
    this.directions = [0, 45, 90, 135, 180, 225, 270];
    this.stateQueue = [];
    this.owner = sprite;
}

//find a random opposing badguy
GeneralBehavior.prototype.lockOnAny = function(){
    var sprite = jc.randomNum(0, this.owner.enemyTeam.length-1);
    this.locked = this.owner.enemyTeam[sprite];
    return sprite;
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this), this.owner.enemyTeam);
}


GeneralBehavior.prototype.getClosestFriendToSupport = function(){
    return this.lockOnClosest(this.isTankOrRange.bind(this), this.owner.homeTeam);
}

GeneralBehavior.prototype.isTankOrRange = function(target){
    if (target.behaviorType == 'tank' || target.behaviorType == 'range'){
        return true;
    }
    return false;
}

//loops through all hometeam sprites and checks to see if any of them are locked onto the target
GeneralBehavior.prototype.isUnlocked = function(target){
    for (var i =0; i< this.owner.homeTeam.length; i++){
        var sprite = this.owner.homeTeam[i];
        if (sprite!=this.owner){
            //check locked
            if (sprite.behavior.locked == target){
                return false;
            }
        }
    }
    return true;
}

//lock onto the closest bad guy but use the check function for exceptions
GeneralBehavior.prototype.lockOnClosest = function(checkFunc, team){
    var currentlyLocked = undefined;
    var winSize = cc.Director.getInstance().getWinSize()
    var minDistance = winSize.width;
    for (var i =0; i< team.length; i++){
        var sprite = team[i];
        if (sprite.isAlive()){
            var vector = this.getVectorTo(sprite.getBasePosition(), this.owner.getBasePosition());
            if (vector.distance < minDistance){
                if (checkFunc != undefined){
                    if (checkFunc(sprite)){
                        minDistance = vector.distance;
                        currentlyLocked = sprite;
                    }
                }else{
                    minDistance = vector.distance;
                    currentlyLocked = sprite;
                }
            }
        }
    }

    return currentlyLocked;
}
GeneralBehavior.prototype.seekEnemy = function(){
    if (!this.locked){
        throw "invalid state, character must be locked to seek.";
    }
    return this.seek(this.locked.getBasePosition());
}

GeneralBehavior.prototype.seek = function(toPoint){

    if (!this.owner){
        throw "Owning game object required";
    }

    var myFeet = this.owner.getBasePosition();
    var mySize = this.owner.getTextureRect();
    //if locked on someone else, target radius behind them
    //otherwise, target radius face to face
    var side = this.leftOrRight(myFeet, toPoint);
    var attackPosition =0;
    if (side == 'left'){
        attackPosition = cc.p(toPoint.x - mySize.width, toPoint.y);
        if (this.owner.isFlippedX()){
            this.owner.setFlipX(false);
        }
    }else{ //right
        attackPosition = cc.p(toPoint.x + mySize.height, toPoint.y);
        if (!this.owner.isFlippedX()){
            this.owner.setFlipX(true);
        }
    }

    var vector = this.getVectorTo(attackPosition, myFeet);

    if (vector.xd < this.owner.gameObject.targetRadius && vector.yd < 25){
        return cc.p(0,0);
    }

    var speed = 0;
    if (this.owner.gameObject.speed > vector.distance){
        speed = vector.distance; //slow down
    }else{
        speed = this.owner.gameObject.speed;
    }

    return cc.pMult(cc.pNormalize(vector.direction), speed);
}


GeneralBehavior.prototype.getVectorTo= function(to, from){
    if (!to || !from){
        throw "To and From positions required!";
    }
    var direction = cc.pSub(to,from);
    var xd = Math.abs(to.x - from.x);
    var yd = Math.abs(to.y - from.y);
    var distance = cc.pLength(direction);
    return {direction:direction, distance:distance, xd:xd, yd:yd};
}


GeneralBehavior.prototype.moveToward = function(point, dt){

    // Update position based on velocity
    var newPosition = cc.pAdd(this.owner.getBasePosition(), cc.pMult(point, dt));

    this.owner.setBasePosition(newPosition);

}



GeneralBehavior.prototype.leftOrRight = function (me, them){
    if (me.x < them.x){
        return 'left';
    }else{
        return 'right';
    }
}

GeneralBehavior.prototype.getRandomFleePosition = function(){
    //find a random spot, targetRadius away
    var randomAngle = jc.randomNum(0,this.directions.length);
    var direction = cc.pForAngle(randomAngle);
    var destination = cc.pMult(direction, this.owner.targetRadius);
    return this.clamp(destination);

}

GeneralBehavior.prototype.clamp=function(point){
    var winSize = cc.Director.getInstance().getWinSize();
    var mySize = this.owner.getTextureRect();
    var rightLimit = winSize.width - mySize.width;
    var leftLimit = mySize.width;
    var topLimit = winSize.height - mySize.height;
    var bottomLimit = mySize.height;

    if (point.x > rightLimit){
        point.x = rightLimit;
    }

    if (point.x < leftLimit){
        point.x = leftLimit;
    }

    if( point.y > topLimit){
        point.y = topLimit;
    }

    if (point.y < bottomLimit){
        point.y = bottomLimit;
    }
    return point;
}

GeneralBehavior.prototype.healLogic = function(){
    if (!this.support){
        return;
    }
    //can't heal a dead guy or full hp
    if (this.support.gameObject.hp<0 || this.support.gameObject.hp == this.support.gameObject.MaxHP){
        return;
    }

    //todo: implement me this.owner.layer.doHealParticle(this.locked);
    this.support.gameObject.hp+= this.owner.gameObject.heal;
}


GeneralBehavior.prototype.hitLogic = function(){
    if (!this.locked){
        return;
    }
    if (this.locked.gameObject.hp>0){
        this.locked.gameObject.hp-=this.owner.gameObject.damage;
    }
    this.owner.layer.doBlood(this.locked);
    if (this.locked.gameObject.hp <=0){
        this.locked.behavior.setState('dead', 'dead');
    }else{
        //this.locked.behavior.setState(undefined, 'damage'); //damage shouldn't interupt whatever is happening.
    }

}

GeneralBehavior.prototype.think = function(dt){
    //todo remove this:
    if (this.owner.isAlive()){
        this.handleState(dt);
    }
}

GeneralBehavior.prototype.handleState = function(dt){
    var state= this.getState();
    if (!this.owner.isAlive() && state.brain!='dead'){
        this.setState('dead','dead');
        return;
    }


    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'move':this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'damage':this.handleDamage(dt);
            break;
    }
}

GeneralBehavior.prototype.handleDamage = function(dt){
    var state= this.getState();
    if (state.anim == 'idle'){
        this.setState('idle', 'idle');
    }
}

GeneralBehavior.prototype.handleFight = function(dt){

    //is my target alive?

    if (!this.locked){
        this.setState('idle', 'idle');
        return;
    }

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

GeneralBehavior.prototype.handleIdle = function(dt){
    //if I'm idle, lock on
    this.locked = this.lockOnClosestUnlocked();
    if (!this.locked){
        this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam);
    }

    if (this.locked){
        this.setState('move', 'move');
    }
}

GeneralBehavior.prototype.handleMove = function(dt){
    var point = this.seekEnemy();
    if (point.x == 0 && point.y == 0){
        //arrived - attack
        this.setState('fighting', 'attack');
        return;
    }
    this.moveToward(point, dt);
}
