


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
            if (this.animationState == 'damage'){
                this.resume();
            }else{
                this.animationState = newState;
                this.owner.setState(this.animationState);
            }
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

GeneralBehavior.prototype.targetWithinRadius = function(target){
    return this.withinRadius(target.getBasePosition());
}

GeneralBehavior.prototype.withinRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadiusY()/8);
}

GeneralBehavior.prototype.withinThisRadius = function(toPoint, xRad, yRad){
    var feet = this.owner.getBasePosition();
    var vector = this.getVectorTo(toPoint, feet);
    if (vector.xd <= xRad && vector.yd <= yRad){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.targetWithinSeekRadius = function(target){
    var feet = this.owner.getBasePosition();
    var vector = this.getVectorTo(target.getBasePosition(), feet);
    if (vector.distance <= this.owner.getSeekRadius()){
        return true;
    }else{
        return false;
    }
}

//find an enemy that that is within my attack radius
GeneralBehavior.prototype.lockOnEnemyInRadius = function(){
    return this.lockOnClosest(this.targetWithinSeekRadius.bind(this), this.owner.enemyTeam);
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this), this.owner.enemyTeam);
}

GeneralBehavior.prototype.lockOnClosestFriendlyNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.homeTeam);
}

GeneralBehavior.prototype.lockOnClosestNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.enemyTeam);
}

GeneralBehavior.prototype.isNot = function(nots,target){
    if (nots.indexOf(target.behaviorType) == -1){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.is = function(iss,target){
    if (iss.indexOf(target.behaviorType) != -1){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.getClosestFriendToSupport = function(){
    return this.lockOnClosest(this.is.bind(this, ['tank', 'range']), this.owner.homeTeam);
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

    var attackPosition = this.getWhereIShouldBe('front', 'facing', this.locked);

    return this.seek(attackPosition);
}


GeneralBehavior.prototype.getWhereIShouldBe = function(position, facing, target){

    if (!target){
        return this.owner.getBasePosition();
    }
    var mySize = this.owner.getTextureRect();
    var toPoint = target.getBasePosition();
    var supportPos;

    if (position == 'front'){
        //if my target is flip x and i am supposed to be infront of them, that means
        //I need to position myself to their right, ortherwise left
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x - mySize.width, toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x + mySize.width, toPoint.y);
        }

    }

    if (position == 'behind'){
        //if my target is flip x and i am supposed to be behind of them, that means
        //I need to position myself to their left, otherwise right
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x + mySize.width, toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x - mySize.width, toPoint.y);
        }

    }

    //if I am to face the character and I am in front of them, I need to be the opposite flipx
    if (facing == 'facing' && position == 'front'){
        this.owner.setFlipX(!target.isFlippedX())
    }

    //if I am to face the character and i am behind them I need to be the same flipx
    if (facing == 'facing' && position == 'behind'){
        this.owner.setFlipX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am front of them I need to be same flipx
    if (facing == 'away' && position == 'font'){
        this.owner.setFlipX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am behind them of them I need to be opposite flipx
    if (facing == 'away' && position == 'behind'){
        this.owner.setFlipX(!target.isFlippedX())
    }

    return supportPos;
}

GeneralBehavior.prototype.seek = function(toPoint){

    if (!this.owner){
        throw "Owning game object required";
    }


    if (this.withinRadius(toPoint)){
        return cc.p(0,0);
    }

    var myFeet = this.owner.getBasePosition();

    var vector = this.getVectorTo(toPoint, myFeet);


    var speed = 0;
    speed = this.owner.gameObject.speed;


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
//    var separate = this.separate();
//    var point = cc.pAdd(separate, point);
    var newPosition = cc.pAdd(this.owner.getBasePosition(), cc.pMult(point, dt));
    this.owner.setBasePosition(newPosition);

}

GeneralBehavior.prototype.getRandomFleePosition = function(){
    //find a random spot, targetRadius away
    var randomAngle = jc.randomNum(0,this.directions.length);
    var direction = cc.pForAngle(randomAngle);
    var destination = cc.pMult(direction, this.owner.getTargetRadius());
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
    if (this.support.gameObject.hp<0 || this.support.gameObject.hp >= this.support.gameObject.MaxHP){
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
        this.locked.behavior.damager = this.owner;
        this.locked.behavior.setState('damage', undefined); //damage shouldn't interupt whatever is happening.
    }

}

GeneralBehavior.prototype.think = function(dt){
    //todo remove this:
    this.handleState(dt);

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

    if (this.damager && this.damager.isAlive() && this.damager != this.locked){
        this.setState('idle', 'idle'); //give us a chance to decide to attack the damager, or someone else nearby
    }else{
        this.resume();
    }


    //otherwise do nothing and recheck
}

GeneralBehavior.prototype.handleFight = function(dt){

    //is my target alive?
    var state= this.getState();
    if (!this.locked && state.anim.indexOf('attack')==-1){
        this.setState('idle', 'idle');
        return;
    }

    if (!this.locked.isAlive() && state.anim.indexOf('attack')==-1){
        this.setState('idle', 'idle');
        return;
    }

    //get the action delay for attacking
    var actionDelay = this.owner.gameObject.actionDelays['attack'];
    var damageDelay = this.owner.gameObject.effectDelays['attack'];
    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        if (this.owner.name == 'orge'){
            console.log('what?');
        }

        this.setAttackAnim('fighting');
        this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

GeneralBehavior.prototype.setAttackAnim = function(state){
    if (this.attackSequence==undefined){
        this.attackSequence = 1;
    }

    if (this.attackSequence == 1){
        this.setState(state, 'attack');

    }else{
        var nextAttack = 'attack'+this.attackSequence;
        if (this.owner.animations[nextAttack]){
            this.setState(state, nextAttack);
        }else{
            this.attackSequence = 0;
            this.setState(state, 'attack');
        }
    }
    this.attackSequence++;
}

GeneralBehavior.prototype.handleIdle = function(dt){
    //lock on who-ever is closest
    if (!this.locked || !this.withinRadius(this.locked.getBasePosition())){
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
        this.setState('fighting', 'move'); //switch to fight, but keep animation the same
        return;
    }
    this.moveToward(point, dt);
}

GeneralBehavior.prototype.separate = function(){
    var steering = cc.p(0,0);
    var myTeam = this.owner.homeTeam;
    for (var i =0; i< myTeam.length; i++) {
        if (myTeam[i] != this.owner){
            var ally = myTeam[i];
            var vector = this.getVectorTo(this.owner.getBasePosition(), ally.getBasePosition());
            var SEPARATE_THRESHHOLD = 100;

            if (vector.xd < SEPARATE_THRESHHOLD || vector.yd < SEPARATE_THRESHHOLD) {
                steering = cc.pAdd(steering, vector.direction);
            }
        }
    }
    return steering;
}
