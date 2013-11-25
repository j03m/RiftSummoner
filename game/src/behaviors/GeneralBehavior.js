


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
GeneralBehavior.prototype.setState = function(brainState, animationState, callback){
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
            if (callback){
                callback();
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


GeneralBehavior.prototype.targetWithinRadius = function(target){
    return this.withinRadius(target.getBasePosition());
}

GeneralBehavior.prototype.targetWithinVariableRadius = function(radius, target){
    return this.withinThisRadius(target.getBasePosition(), radius, radius);
}


GeneralBehavior.prototype.targetWithinVariableRadiusAndLocation = function(radius, point, target){
    return this.withinThisRadiusOf(target.getBasePosition(), point, radius, radius);
}


GeneralBehavior.prototype.withinRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadiusY());
}

GeneralBehavior.prototype.whosCloser = function(first, second){
    var vector1 = this.getVectorTo(first.getBasePosition(), this.owner.getBasePosition());
    var vector2 =  this.getVectorTo(second.getBasePosition(), this.owner.getBasePosition());
    if (vector2.distance < vector1.distance){
        return -1;
    }
    if (vector1.distance < vector2.distance){
        return 1;
    }
    return 0;

}
GeneralBehavior.prototype.withinThisRadiusOf = function(fromPoint, toPoint, xRad, yRad){
    var vector = this.getVectorTo(toPoint, fromPoint);
    if (vector.xd <= xRad && vector.yd <= yRad){
        return true;
    }else{
        return false;
    }
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
    return this.lockOnClosest(this.targetWithinSeekRadius.bind(this), this.owner.enemyTeam());
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this), this.owner.enemyTeam());
}

GeneralBehavior.prototype.lockOnClosestFriendlyNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.homeTeam());
}

GeneralBehavior.prototype.lockOnClosestNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.enemyTeam());
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
    return this.lockOnClosest(this.is.bind(this, ['tank', 'range']), this.owner.homeTeam());
}

//loops through all homeTeam() sprites and checks to see if any of them are locked onto the target
GeneralBehavior.prototype.isUnlocked = function(target){
    for (var i =0; i< this.owner.homeTeam().length; i++){
        var sprite = this.owner.homeTeam()[i];
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
    var winSize = this.getWorldSize();
    var minDistance = winSize.width;
    for (var i =0; i< team.length; i++){
        var sprite = team[i];
        if (sprite.isAlive() && this.canTarget(sprite)){
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

GeneralBehavior.prototype.canTarget = function(sprite){
    if (sprite.gameObject.movementType == this.owner.gameObject.targets || this.owner.gameObject.targets == jc.targetType.both ){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.allPassCheck = function(checkFunc, team){
    var success = [];
    for (var i =0; i< team.length; i++){
        var sprite = team[i];
        if (sprite.isAlive() && sprite != this.owner){
            if (checkFunc(sprite)){
                success.push(sprite);
            }
        }
    }
    return success;
}

GeneralBehavior.prototype.allFriendsWithinRadius = function(radius){
    return this.allPassCheck(this.targetWithinVariableRadius.bind(this, radius), this.owner.homeTeam());
}


GeneralBehavior.prototype.allFoesWithinRadius = function(radius){
    return this.allPassCheck(this.targetWithinVariableRadius.bind(this, radius), this.owner.enemyTeam());
}

GeneralBehavior.prototype.allFoesWithinRadiusOfPoint = function(radius, point){
    return this.allPassCheck(this.targetWithinVariableRadiusAndLocation.bind(this, radius, point), this.owner.enemyTeam());
}


GeneralBehavior.prototype.seekEnemy = function(){
    if (!this.locked){
        throw "invalid state, character must be locked to seek.";
    }

    var attackPosition = this.getWhereIShouldBe('front', 'facing', this.locked);
    attackPosition = this.adjustFlock(attackPosition);

    //apply a position augment if it's there - usually for flying animals to be far off their targets
    if (this.owner.gameObject.flightAug){
        if (!this.owner.isFlippedX()){
            this.owner.gameObject.flightAug.x*=-1;
        }
        attackPosition = cc.pAdd(attackPosition, this.owner.gameObject.flightAug);
    }


    //if the place im trying to go is outside of the elipse, send me to center.
    //this sort of blows.
    if (this.owner.gameObject.movementType == jc.movementType.ground){
        var center = cc.p(this.owner.layer.winSize.width/2, this.owner.layer.winSize.height/2);
        if (!jc.insideEllipse(600,300, attackPosition,center)){
            attackPosition = center;
        }
    }

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
        this.owner.setFlippedX(!target.isFlippedX())
    }

    //if I am to face the character and i am behind them I need to be the same flipx
    if (facing == 'facing' && position == 'behind'){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am front of them I need to be same flipx
    if (facing == 'away' && position == 'font'){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am behind them of them I need to be opposite flipx
    if (facing == 'away' && position == 'behind'){
        this.owner.setFlippedX(!target.isFlippedX())
    }


    return supportPos;
}

GeneralBehavior.prototype.adjustFlock = function(toPoint){
    var friends = this.allFriendsWithinRadius(10);
    var pos = this.owner.getBasePosition();
    if (friends.length!=0){
        for (var i =0; i<friends.length;i++){
            //if we're locked onto the same person
            var diff = Math.abs(friends[i].getBasePosition().y-pos.y);

            if (diff<10 && this.owner.flockedOff !=friends[i]){
                //adjust my seek position by 10px y north
                friends[i].flockedOff = this.owner;
                toPoint.y+=25;
                break;
            }
        }
    }
    return toPoint;

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


    var speed = this.owner.gameObject.speed;
    if (!speed){
        throw "Character: " + this.owner.name + " speed not defined.";
    }

    var raw = cc.pMult(cc.pNormalize(vector.direction), speed);


    return raw;
}


GeneralBehavior.prototype.getVectorTo= function(to, from){
    return jc.getVectorTo(to,from);
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
GeneralBehavior.prototype.getWorldSize=function(){
    return this.owner.layer.worldSize;
}
GeneralBehavior.prototype.clamp=function(point){
    var winSize = this.getWorldSize();
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

    GeneralBehavior.heal(this.owner, this.support, this.owner.gameObject.heal);

}

GeneralBehavior.heal = function(healer, target, value){
    //can't heal a dead guy or full hp
    if (target.gameObject.hp<0 || target.gameObject.hp >= target.gameObject.MaxHP){
        return false;
    }

    if (target.gameObject.hp + value < target.gameObject.MaxHP){
        target.gameObject.hp+= value;
    }else{
        target.gameObject.hp= target.gameObject.MaxHP;
    }

    return true;
}

GeneralBehavior.prototype.hitLogic = function(){
    if (!this.locked){
        return;
    }

    //apply damage to the target
    GeneralBehavior.applyDamage(this.locked, this.owner, this.owner.gameObject.damage);

    //if the character in question has damageMod effects, we need to do them here
    this.damageEffects();
}

GeneralBehavior.prototype.damageEffects = function(){
    var config = spriteDefs[this.owner.name];
    var powers = config.damageMods;
    for(var power in powers){
        powers[power].name = power;
        this.doDamageMod(powers[power]);
    }
};


GeneralBehavior.prototype.deathEffects = function(){
    var config = spriteDefs[this.owner.name];
    var powers = config.deathMods;
    for(var power in powers){
        powers[power].name = power;
        this.doDamageMod(powers[power]);
    }
};

GeneralBehavior.prototype.doDamageMod=function(power){
    var powerFunc = powerConfig[power.name].bind(this);
    powerFunc(this.owner.name); //one time
}

GeneralBehavior.applyDamage = function(target, attacker, amount, elementType){

    if (!elementType && !attacker){
        throw "must supply an attacker or an elementType";
    }

    if (!elementType){
        var attackDef = spriteDefs[attacker.name];
        elementType = attackDef.elementType;
    }

    //apply elemental defenses
    if (target.gameObject.defense){
        for(var element in target.gameObject.defense){
            if (element == elementType){
                var reduction = amount * (target.gameObject.defense[element]/100);
                amount -=reduction;
                if (amount<0){
                    amount = 0;
                }
            }
        }
    }

    //apply flank bonus
    if (attacker){
        if (target.behavior.locked != attacker && attacker.behaviorType != "range"){
            amount += amount * 0.2;
        }
    }

   return  GeneralBehavior.applyGenericDamage(target, attacker, amount)

}

GeneralBehavior.applyGenericDamage = function(target, attacker, amount){
    if (target.gameObject.hp>0){
        target.gameObject.hp-=amount;
        if (target.gameObject.hp <=0){
            target.behavior.setState('dead', 'dead');
        }else{
            if (attacker){
                target.behavior.damager = attacker;
            }
        }
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.think = function(dt){
    //todo remove this:
    this.handleState(dt);

}

GeneralBehavior.prototype.handleDeath = function(){

    if (!this.callbacksDisabled){
        var state= this.getState();
        if (!this.owner.isAlive() && state.brain!='dead'){
            this.setState('dead','dead');
        }

        if (!this.owner.isAlive()){
            this.owner.unscheduleAllCallbacks();
            this.deathEffects();
            this.callbacksDisabled = 1;
        }
    }else{
        if (this.callbacksDisabled == 1){
            this.owner.scheduleOnce(this.deadForGood.bind(this), 3);
            this.callbacksDisabled++;
        }

    }

}

GeneralBehavior.prototype.deadForGood = function(){
    this.owner.die();
//    this.homeTeam() = _.reject(this.homeTeam(), function(member){
//        return member == this.owner;
//    });
}

GeneralBehavior.prototype.handleState = function(dt){
    this.handleDeath();
    var state= this.getState();
    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'move':this.handleMove(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
        case 'damage':this.handleDamage(dt);
            break;
        case 'followUserCommand':this.followUserCommand(dt);
            break;
    }
    this.afterEffects();
}

GeneralBehavior.prototype.handleDamage = function(dt){

//    if (this.damager && this.damager.isAlive() && this.damager != this.locked){
//        this.resume();
//    }else{
//        this.resume();
//    }


    //otherwise do nothing and recheck
}

GeneralBehavior.prototype.handleFight = function(dt){

    //is my target alive?
    var state= this.getState();
    if (!this.locked && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
        return;
    }

    if (!this.locked.isAlive() && state.anim.indexOf('attack')==-1){
        this.setState('idle', state.anim);
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
        this.setAttackAnim('fighting', function(){
            var point = this.seekEnemy();
            if (point.x != 0 || point.y != 0){
                //out of range, they fled or we got knocked back
                this.setState('move', 'move');
                return;
            }
        }.bind(this));
        this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

GeneralBehavior.prototype.setAttackAnim = function(state, callback){
    if (this.attackSequence==undefined){
        this.attackSequence = 1;
    }

    if (this.attackSequence == 1){
        this.setState(state, 'attack');

    }else{
        var nextAttack = 'attack'+this.attackSequence;
        if (this.owner.animations[nextAttack]){
            this.setState(state, nextAttack, callback);
        }else{
            this.attackSequence = 0;
            this.setState(state, 'attack', callback);
        }
    }
    this.attackSequence++;
}

GeneralBehavior.prototype.handleIdle = function(dt){
    //lock on who-ever is closest
    if (this.locked && this.damager && this.locked!=this.damager){ //if im being attacked and I'm locked, and they are not the same person
        var closer = this.whosCloser(this.locked, this.damager);
        if (closer == 1){
            this.damager = undefined; //stop worrying about damage, stay on target
        }

        if (closer == -1){ //switch targets
            this.locked = this.damager;
            this.damager = undefined;
        }

        if (closer == 0){
            //don't change anything for now, but check again later.
        }

    }

    if (!this.locked || !this.withinRadius(this.locked.getBasePosition())){
        this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam());
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


GeneralBehavior.prototype.followUserCommand = function(dt){
    var point = this.seek(this.followPoint);
    if (point.x == 0 && point.y == 0){
        //arrived - attack
        this.setState('idle', 'idle'); //switch to idle - user command is done
        return;
    }
    this.moveToward(point, dt);
}

GeneralBehavior.prototype.separate = function(){
    var steering = cc.p(0,0);
    var myTeam = this.owner.homeTeam();
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

GeneralBehavior.prototype.doPower = function(power){
    var powerFunc = powerConfig[power.name].bind(this);
    powerFunc(this.owner.name);
}

GeneralBehavior.prototype.afterEffects = function(){
    //apply my power
    if (!this.owner.isAlive()){
        return; //no need
    }
//    var config = spriteDefs[this.owner.name];
//    var powers = config.powers;
//    for(var power in powers){
//        powers[power].name = power;
//        this.doPower(powers[power]);
//    }
//
//    //removes effects that have expired
//    var effect;
//    for (var effectName in this.owner.effects){
//        effect = this.owner.effects[effectName];
//        if (effect.total > effect.duration){
//            this.removeEffects(effect);
//            delete this.owner.effects[effectName]
//        }
//    }
//
//    //apply anything still effecting me
//    for (var effectName in this.owner.effects){
//        effect = this.owner.effects[effectName];
//        this.applyEffects(effect);
//    }

    if (!this.scheduledPowers){
        this.scheduledPowers = {};
    }
    var config = spriteDefs[this.owner.name];
    var powers = config.powers;
    //llp through powers
    for(var power in powers){
        //if it's not scheduled
        if (!this.scheduledPowers[power]){
            //create a bound function with the power
            powers[power].name = power;
            var powerFunc = this.doPower.bind(this, powers[power]);
            //schedule it
            this.owner.schedule(powerFunc, powers[power].interval);
            //mark it as scheduled
            this.scheduledPowers[power] = powers[power];
        }
    }

    if (!this.scheduledEffects){
        this.scheduledEffects = {};
    }
    //for each effect on the user
    for (var effectName in this.owner.effects){
        //get the effect
        var effect = this.owner.effects[effectName];
        if (!this.scheduledEffects[effectName]){
            var effectFunc = this.applyEffects.bind(this, effect);
            var removeEffectFunc = this.removeEffects.bind(this, effect, effectFunc, effectName);
            //why -2? cocos2d scheduler goes over by 1, so we pull back 2 to make sure this is over before remove fires.
            //ghetto...but - have you built an RTS on your own?
            this.owner.schedule(effectFunc, effect.interval, (effect.duration/effect.interval)-2, undefined);
            if (effect.duration){
                this.owner.scheduleOnce(removeEffectFunc, effect.duration);
            }
            this.scheduledEffects[effectName] = effect;
        }
    }



};

GeneralBehavior.prototype.followCommand = function(position){
    this.followPoint = position;
    this.setState('followUserCommand', 'move');
}

GeneralBehavior.prototype.attackCommand = function(target){
    this.locked = target;
    this.setState('move', 'move');
}

GeneralBehavior.prototype.supportCommand = function(target){
    this.support = target;
    this.setState('move', 'move');
}


GeneralBehavior.prototype.removeEffects = function(effect, effectFunc, effectName){
    var func = powerConfig[effect.name + "-remove"].bind(this);
    func(effect);
    this.owner.unschedule(effectFunc);
    this.owner.removeEffect(effectName);
    this.scheduledEffects[effectName] = undefined;

}

GeneralBehavior.prototype.applyEffects = function(effect){
    var func = powerConfig[effect.name + "-apply"].bind(this);
    func(effect);
}
