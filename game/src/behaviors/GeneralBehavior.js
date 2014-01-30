


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
    return this.vectorTest(vector,xRad, yRad);
}

GeneralBehavior.prototype.withinThisRadius = function(toPoint, xRad, yRad){
    var feet = this.owner.getBasePosition();
    var vector = this.getVectorTo(toPoint, feet);
    return this.vectorTest(vector,xRad, yRad);
}

GeneralBehavior.prototype.vectorTest = function(v, xd, yd){
    var vxd = v.xd - this.getMaxWidth()/4;
    var vyd = v.yd;
    if (vxd <= xd && vyd <= yd){
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
    return this.lockOnClosest(undefined, this.owner.otherteam, this.owner.getSeekRadius(), this.owner.getSeekRadius());
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this), this.owner.otherteam);
}

GeneralBehavior.prototype.lockOnClosestFriendlyNonTank = function(){
    return this.lockOnClosest(this.isUndefended.bind(this), this.owner.team);
}

GeneralBehavior.prototype.lockOnClosestNonTank = function(){
    return this.lockOnClosest(this.is.bind(this, ['healer', 'range']), this.owner.otherteam);
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

GeneralBehavior.prototype.getHurtComrads = function(){
    return this.owner.layer.hurt[this.owner.team];
}

GeneralBehavior.prototype.getClosestFriendToSupport = function(){
    var whosHurt = this.getHurtComrads();
    var minSprite;
    var minDistance= this.owner.layer.worldSize.width;
    var pos = this.owner.getBasePosition();
    for(var i =0;i<whosHurt.length;i++){
        if (whosHurt[i]!= this.owner){
            var vector = this.getVectorTo(whosHurt[i].getBasePosition(), pos);
            if (vector.distance < minDistance){
                minDistance = vector.distance;
                minSprite = whosHurt[i];
            }
        }
    }

    if (minSprite){
        return minSprite;
    }else{
        return this.lockOnClosest(undefined, this.owner.team, true); //lock on and follow anyone
    }


}

GeneralBehavior.prototype.needsAHealer = function(target){

    if (target.gameObject.hp < target.gameObject.MaxHP && target.isAlive() && target.name != "nexus"){
        return true;
    }else{
        return false;
    }
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

GeneralBehavior.prototype.isUndefended = function(target){
    if (target.behaviorType != 'range' && target.behaviorType != 'healer' && target.behaviorType != 'nexus'){
        return false;
    }

    for (var i =0; i< this.owner.homeTeam().length; i++){
        var sprite = this.owner.homeTeam()[i];
        if (sprite!=this.owner){
            //check locked
            if (sprite.behavior.support == target){
                return false;
            }
        }
    }
    return true;
}


GeneralBehavior.prototype.getSliceData = function(){
    var slices = this.owner.layer.slices;
    if (!slices){
        throw "slice map not init";
    }

    var mySlice = this.owner.layer.getSliceFor(this.owner.id);
    if (mySlice == undefined){
        this.owner.setBasePosition(this.owner.getBasePosition());//hack force a reset
        mySlice = this.owner.layer.getSliceFor(this.owner.id);
    }

    //which direction should we search?
    var iter = 0;
    var start = 0;
    if (this.owner.team == 'a'){
        if (mySlice != 0){
            start = mySlice-1;
        }else{
            start =0;
        }
        iter = 1;
    }else{
        if (mySlice != this.owner.layer.sliceCount){
            start = mySlice+1;
        }else{
            start = this.owner.layer.sliceCount
        }

        iter = -1;
    }

    return {start:start, iter:iter, slices:slices};
}




GeneralBehavior.prototype.lockOnClosest = function(checkFunc, team, ignoreNexus){

    var sliceData = this.getSliceData()
    var slices = sliceData.slices;
    var start = sliceData.start;
    var iter = sliceData.iter;
    var nexusSlice;
    if (this.owner.team == 'a'){
        var id = this.owner.layer.teamANexus.id;
        nexusSlice = this.owner.layer.idToSlice[id];
    }

    //slices are broken up into search groups based on target movement type (air to ground) etc
    var airGroup = team + jc.movementType.air;
    var groundGroup = team + jc.movementType.ground;


    //depending on what I can target

    var sliceAry
    var finalSliceAry = [];
    var aryCount = 0;
    if (iter==1){
        for(var i=start;i<slices[airGroup].length;i++){
            if (i == nexusSlice && ignoreNexus){
                continue;
            }

            if (this.targetsAir()){
                var sliceAry = this.sliceMapAsArray(slices, airGroup, i);
                if (sliceAry.length != 0){
                    //don't select a slice with just me in it
                    if (sliceAry.indexOf(this.owner)!=-1 && sliceAry.length == 1){
                        continue;
                    }
                    finalSliceAry = finalSliceAry.concat(sliceAry);
                    break;
                }
            }
            if (this.targetsGround()){
                var sliceAry = this.sliceMapAsArray(slices, groundGroup, i);
                if (sliceAry.length != 0){
                    //don't select a slice with just me in it
                    if (sliceAry.indexOf(this.owner)!=-1 && sliceAry.length == 1){
                        continue;
                    }
                    finalSliceAry = finalSliceAry.concat(sliceAry);
                    break;
                }
            }

        }
    }else{
        for(var i=start;i>0;i--){
            if (i == nexusSlice && ignoreNexus){
                continue;
            }

            if (this.targetsAir()){
                var sliceAry = this.sliceMapAsArray(slices, airGroup, i);
                if (sliceAry.length != 0){
                    //don't select a slice with just me in it
                    if (sliceAry.indexOf(this.owner)!=-1 && sliceAry.length == 1){
                        continue;
                    }
                    finalSliceAry = finalSliceAry.concat(sliceAry);
                    break;
                }
            }
            if (this.targetsGround()){
                var sliceAry = this.sliceMapAsArray(slices, groundGroup, i);
                if (sliceAry.length != 0){
                    //don't select a slice with just me in it
                    if (sliceAry.indexOf(this.owner)!=-1 && sliceAry.length == 1){
                        continue;
                    }
                    finalSliceAry = finalSliceAry.concat(sliceAry);
                    break;
                }

            }
        }
    }

    //return an random dude from that slice
    if (finalSliceAry && finalSliceAry.length>0){
        for(var i =0;i<5;i++){
            var index = jc.randomNum(0,finalSliceAry.length-1);
            var target = finalSliceAry[index];
            if (target != this.owner && target.isAlive() && target != this.owner){
                if (!checkFunc){
                    return target;
                }else{
                    if (checkFunc(target)){
                        return target;
                    }
                }
            }
        }
        jc.log['targetting', "Tried 3 times to locate a target that was not me and alive"];
    }else{
        jc.log['targetting', "couldn't find a target"];
    }




}

GeneralBehavior.prototype.sliceMapAsArray = function(slices, group, index){
    for(var key in slices[group][index]){
        var sliceAry = _.toArray(slices[group][index]);
        return sliceAry;
    }
    return [];
}

GeneralBehavior.prototype.targetsAir = function(){
    if (jc.targetType.air == this.owner.gameObject.targets || this.owner.gameObject.targets == jc.targetType.both ){
        return true;
    }else{
        return false;
    }
}

GeneralBehavior.prototype.targetsGround = function(){
    if (jc.targetType.ground == this.owner.gameObject.targets || this.owner.gameObject.targets == jc.targetType.both ){
        return true;
    }else{
        return false;
    }
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
        return;
    }


    var attackPosition = this.getWhereIShouldBe('front', 'facing', this.locked);

    //apply a position augment if it's there - usually for flying animals to be far off their targets
    if (this.owner.gameObject.flightAug && this.locked.gameObject.movementType == jc.movementType.ground){
        if (!this.owner.isFlippedX()){
            this.owner.gameObject.flightAug.x*=-1;
        }
        attackPosition = cc.pAdd(attackPosition, this.owner.gameObject.flightAug);
    }


    //if the place im trying to go is outside of the elipse, send me to center.
    //this sort of blows.
    if (this.owner.gameObject.movementType == jc.movementType.ground){
        var center = cc.p(this.owner.layer.winSize.width/2, this.owner.layer.winSize.height/2);
        if (!jc.insidePlayableRect(attackPosition)){
            attackPosition = center;
        }
    }

    return this.seek(attackPosition);
}


GeneralBehavior.prototype.getWhereIShouldBe = function(position, facing, target){


    if (!target){
        return this.owner.getBasePosition();
    }

    var toPoint = target.getBasePosition();
    var supportPos;

    if (position == 'front'){
        //if my target is flip x and i am supposed to be infront of them, that means
        //I need to position myself to their right, ortherwise left
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x - this.getMaxWidth(), toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x + this.getMaxWidth(), toPoint.y);
        }

    }

    if (position == 'behind'){
        //if my target is flip x and i am supposed to be behind of them, that means
        //I need to position myself to their left, otherwise right
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x + this.getMaxWidth(), toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x - this.getMaxWidth(), toPoint.y);
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

GeneralBehavior.prototype.adjustFlock = function(){
    if (!jc.config.flock){
        return false;
    }


    if(this.flockCount > 5000){
        this.flockAdjust = undefined;
    }

    var def = spriteDefs[this.owner.name];

    var pos = this.owner.getBasePosition();
    var augment = cc.p(0,0);
    var shouldFlock = jc.randomNum(0,1);
    var num = jc.randomNum(0,1);
    var flockMin = 25 * jc.characterScaleFactor;
    var flockMax = 50 * jc.characterScaleFactor;
    var val = jc.randomNum(flockMin, flockMax);
    if (num){
        augment.y+= val;
    }else{
        augment.y-= val;
    }


    if (!this.flockAdjust){
        this.flockCount = 0;
        this.flockAdjust = augment;
    }

    this.flockCount++;

    return shouldFlock;
}

GeneralBehavior.prototype.seek = function(toPoint){

    if (!this.owner){
        throw "Owning game object required";
    }

    if (this.followPoint){
        if (this.withinThisRadius(toPoint, 25*jc.assetScaleFactor,25*jc.assetScaleFactor)){
            this.followPoint = undefined;
            this.setState('idle', 'idle');
            return cc.p(0,0);
        }
    }else{
        if (this.withinRadius(toPoint)){
            return cc.p(0,0);
        }
    }

    //if not, first thing - cap the toPoint to the worldBoundry
    jc.cap(toPoint, this.owner.layer.playableRect);

    var myFeet = this.owner.getBasePosition();

    var vector = this.getVectorTo(toPoint, myFeet);

    var speed = this.owner.gameObject.speed;
    var aug = jc.randomNum(0,25);
    speed+=aug;

    speed *= jc.characterScaleFactor;
    if (!speed){
        throw "Character: " + this.owner.name + " speed not defined.";
    }

    var raw = cc.pMult(cc.pNormalize(vector.direction), speed);
    if (this.adjustFlock()){
        raw = cc.pAdd(raw, this.flockAdjust);
    }
    return raw;
}


GeneralBehavior.prototype.getVectorTo= function(to, from){
    var v = jc.getVectorTo(to,from);
    return v;
}


GeneralBehavior.prototype.moveToward = function(point, dt){
    var go =  cc.pMult(point, dt);
    var newPosition = cc.pAdd(this.owner.getBasePosition(), go);
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
                if (amount<=0){
                    amount = 3; // 3 is the min damage to avoid for example to void dwarves never being able to kill one another
                }
            }
        }
    }

    if (attacker){
        if (attacker.behaviorType == 'range'){
            if (target.gameObject.resistsRange){
                var reduction = amount * target.gameObject.resistsRange/100;
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

GeneralBehavior.prototype.think = function(dt, selected){
    //todo remove this:
    this.handleState(dt, selected);

}

GeneralBehavior.prototype.handleDeath = function(){

    if (!this.callbacksDisabled){
        var state= this.getState();
        if (!this.owner.isAlive() && state.brain!='dead'){
            this.setState('dead','dead');
            if (this.owner.movementType == jc.movementType.air){
                this.owner.fallToShadow();
            }
        }

        if (!this.owner.isAlive()){
            this.owner.unscheduleAllCallbacks();
            this.deathEffects();
            this.callbacksDisabled = 1;
            this.owner.layer.removeSlice(this.owner.id, this.owner.team, this.owner.gameObject.movementType);
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

GeneralBehavior.prototype.collectTextureWidth = function(){
    var width = this.owner.getTextureRect().width;
    if (!this.maxWidth){
        this.maxWidth =width;
    }else if(this.maxWidth < width){
       this.maxWidth = width;
    }

}

GeneralBehavior.prototype.getMaxWidth = function(){
    if (!this.maxWidth){
       this.collectTextureWidth();
    }
    return this.maxWidth;
}

GeneralBehavior.prototype.handleState = function(dt, selected){
    this.collectTextureWidth();
    this.handleDeath();
    var state= this.getState();

    if (this.owner.team == 'b'){
        jc.log('state', this.owner.name + ' ' + this.owner.id + ' ' + state.brain)
    }

    if (selected){
        //if im not locked and I'm following a user command, leave - unless i have a damager and their alive.
        if (!this.forceLocked && state.brain != 'followUserCommand'){
            if (!this.damager || !this.damager.isAlive()){
                return;
            }
        }
    }

    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
//        case 'damage':this.handleDamage(dt);
//            break;
    }
    this.afterEffects();
}


GeneralBehavior.prototype.handleFight = function(dt){

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
            this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);
        }

        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

GeneralBehavior.prototype.setAttackAnim = function(state, callback, prefix){

    var animation = '';
    var foundOne = false;
    if (!prefix){
        prefix = jc.attackStatePrefix.attack;
    }
    var def = spriteDefs[this.owner.name];
    if (!def.animations[prefix]){
        prefix = jc.attackStatePrefix.attack;
    }

    for(var i=0;i<3;i++){
        var num = jc.randomNum(0,3);
        var animation = prefix+num;
        if (this.owner.animations[animation]){
            foundOne = true;
            break
        }
    }

    if(!foundOne){
        animation = prefix;
    }

    this.setState(state, animation, callback);

}

GeneralBehavior.prototype.getAttackAnim = function(){
    if (this.attackSequence==undefined){
        this.attackSequence = 1;
    }

    if (this.attackSequence == 1){
        return 'attack';
    }else{
        var nextAttack = 'attack'+this.attackSequence;
        if (this.owner.animations[nextAttack]){
            return nextAttack;
        }else{
            this.attackSequence = 0;
            return 'attack';
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
        this.forceLocked = false;
        this.locked = this.lockOnClosest(undefined, this.owner.otherteam);
    }

    if (this.locked && !this.locked.isAlive()){
        this.forceLocked = false;
        this.locked = this.lockOnClosest(undefined, this.owner.otherteam);
    }

    if (this.locked){
        this.setState('move', 'move');
    }

}

GeneralBehavior.prototype.handleMove = function(dt){
    //give me a chance to retarget closer;


    var state = this.getState();
    if (state.brain != "move" && state.brain != 'followUserCommand'){
        return;
    }

    if (state.brain ==  'followUserCommand'){
        this.followUserCommand(dt);
        return;
    }

    if (!this.forceLocked){
        this.handleIdle(dt);
    }


    var point = this.seekEnemy();
    if (!point){
        this.setState('idle','idle');
        this.forceLocked = false;
        return;
    }
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
        this.locked = undefined;
        this.support = undefined;
        this.setState('idle', 'idle'); //switch to idle - user command is done
        return;
    }
    this.moveToward(point, dt);
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
    if (this.owner.isAlive()){
        this.followPoint = position;
        this.forceLocked = false;
        this.forceSupport = false;
        this.supportLocked = false;
        this.setState('followUserCommand', 'move');
    }
}

GeneralBehavior.prototype.attackCommand = function(target){
    if (this.owner.isAlive()){
        this.locked = target;
        this.followPoint = undefined;
        this.forceLocked = true;
        this.forceSupport = false;
        this.supportLocked = false;
        this.setState('move', 'move');
    }
}

GeneralBehavior.prototype.supportCommand = function(target){
    if (this.owner.isAlive()){
        this.support = target;
        this.followPoint = undefined;
        this.forceSupport = true;
        this.forceLocked = false;
        this.supportLocked = true;
        this.setState('move', 'move');
    }
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
