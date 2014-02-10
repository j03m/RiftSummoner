
jc.indecisionFactor = 0.025;
jc.stayOnTarget = 0.1;
jc.orient = {};
jc.orient.front = 'front';
jc.orient.behind = 'behind';
jc.orient.facing = 'facing';
jc.orient.away = 'away';

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

GeneralBehavior.prototype.reset = function(){
    this.clearLock()
    this.support = undefined;
    this.setState('idle', 'idle');
    this.callbacksDisabled = undefined;
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


GeneralBehavior.prototype.lockOnClosestFriendlyNonTank = function(){
    return this.lockOnClosest(this.isUndefended.bind(this), this.owner.team, true);
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


GeneralBehavior.prototype.lockOnClosest = function(checkFunc, team, support, skipTable){

    jc.log('lockon', 'I am: ' + this.owner.name + ' id:' + this.owner.id + ' team:' + this.owner.team);

    var sliceData = this.getSliceData();
    var slices = sliceData.slices;
    var start = sliceData.start;
    var iter = sliceData.iter;
    var nexusSlice;

    jc.log('lockon', 'I start: ' + start);


    if (this.owner.team == 'a'){
        var id = this.owner.layer.teamANexus.id;
    }


    var lockFunc;
    if (support){
        lockFunc = this.setSupport.bind(this);
    }else{
        lockFunc = this.setLock.bind(this);
    }

    //slices are broken up into search groups based on target movement type (air to ground) etc
    var airGroup = team + jc.movementType.air;
    var groundGroup = team + jc.movementType.ground;


    var end;
    if (iter == 1){
        end = slices[airGroup].length

    }else{
        end = 0;
    }

    jc.log('lockon', 'I end: ' + end);

    var check = function(iterator, end, val){
        if (val==1){
            return iterator < end;
        }else{
            return iterator > end;
        }
    }

    var final = [];
    var target;
    for(var i=start;check(i, end, iter);i+=iter){

        var sliceAry;
        if (this.targetsAir()){
            jc.log('lockon', 'I target air: ' + end);
            sliceAry = this.sliceMapAsArray(slices, airGroup, i);
            jc.log('lockon', 'slice: ' + i + ' has: ' + sliceAry.length + ' enemies.');
            target = this.checkSlice(checkFunc, sliceAry);
        }

        if (this.targetsGround()){
            jc.log('lockon', 'I target ground: ' + end);
            sliceAry = this.sliceMapAsArray(slices, groundGroup, i);
            jc.log('lockon', 'slice: ' + i + ' has: ' + sliceAry.length + ' enemies.');
            target = this.checkSlice(checkFunc, sliceAry);

        }

        jc.log('lockon', 'Did I find one? Target is not undefined: ' + (target!=undefined));

        final = final.concat(sliceAry);
        if (target!=undefined){
            jc.log('lockon', 'Found a target: ' + target.name + ' - breaking.');
            break;
        }
    }

    if (!target){
        jc.log('lockon', 'No target found');
        target = this.pickRandomTarget(undefined, final, true, 10);

        if (target){
            jc.log('lockon', 'grab random');
            lockFunc(target, skipTable);
        }else if (!support){
            jc.log('lockon', 'target the -nexus-');
            if (this.owner.team == 'a'){
                this.setLock(this.owner.layer.teamBNexus, skipTable);
            }

            if (this.owner.team == 'b'){
                this.setLock(this.owner.layer.teamANexus, skipTable);
            }
        }
    }
}

GeneralBehavior.prototype.checkSlice = function(checkFunc, sliceAry){

    if (sliceAry.length != 0){


        //don't select a slice with just me in it
        if (sliceAry.indexOf(this.owner)!=-1 && sliceAry.length == 1){
            jc.log('lockon', 'Im the only one in this slice.');
            return false;
        }

        var target = this.pickRandomTarget(checkFunc, sliceAry);
        if(target){
            this.setLock(target);
            jc.log('lockon', 'found - ' + target.name);
            return target;
        }

    }else{
        jc.log('lockon', 'No enemies in this slice.');
    }
    jc.log('lockon', 'found no one. ');
    return undefined;
}

GeneralBehavior.prototype.pickRandomTarget = function(checkFunc, ary, ignoreCheck, limit){
    //return an random dude from that slice
    if (!limit){
        limit = ary.length-1;
    }
    if (limit > ary.length-1){
        limit = ary.length-1;
    }

    if (ary && ary.length>0){
        for(var i =0;i<5;i++){ //5 tries
            jc.log('lockon', '>>>select random - try: ' + i);
            var index = jc.randomNum(0,limit);
            var target = ary[index];
            if (target != this.owner && target.isAlive()){
                jc.log('lockon', '>>>not owner and is alive!');
                if (target.id != 'teamanexus' && target.id != 'teambnexus'){
                    jc.log('lockon', '>>>not a nexus!');
                    if (checkFunc && !ignoreCheck){
                        jc.log('lockon', '>>>check Func!');
                        if (checkFunc(target)){
                            jc.log('lockon', '>>>check Func pass - select!');
                            return target;
                        }else{
                            jc.log('lockon', '>>>check Func failed - select!');
                        }
                    }else{
                        jc.log('lockon', 'No check func - select!');
                        return target;
                    }
                }else{
                    jc.log('lockon', 'nexus - skip');
                    continue; //don't attack the nexus until last
                }

            }
        }
        jc.log['lockon', "Tried 5 times to locate a target that was not me and alive"];
    }else{
        jc.log['lockon', "couldn't find a target, no one in there"];
    }

    return undefined;
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

    if (this.timeLocked < this.stayOnTarget){
        return this.stayOnTarget;
    }

    this.orient(undefined, undefined , this.locked);

    var attackPosition = this.lockPosition.supportPos;

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


GeneralBehavior.prototype.getPositionalData = function(position, facing, target){

    var toPoint = target.getBasePosition();
    var myPos = this.owner.getBasePosition();
    var diff = myPos.x - toPoint.x;
    var ownerFlip = this.owner.isFlippedX();
    var targetFlip = target.isFlippedX();

    //where am I approaching, front or back?
    if (facing == undefined){ //if facing is not defined
        //we need to understand where we are approaching from
        if (diff > 0 && targetFlip){  //if diff positive, we are to the right so we need to be behind and facing
            position = jc.orient.behind;
            facing = jc.orient.facing;
        }

        if (diff > 0 && !targetFlip){  //if diff positive, we are to the right but the target is looking at us so we need to be in front and facing
            position = jc.orient.front;
            facing = jc.orient.facing;
        }

        if (diff < 0 && targetFlip){  //if diff negative, we are to the left but the target is looking at us so we need to be in front and facing
            position = jc.orient.front;
            facing = jc.orient.facing;
        }

        if (diff < 0 && !targetFlip){  //if diff negative, we are to the left we need to be behind.
            position = jc.orient.behind;
            facing = jc.orient.facing;
        }
    }

    //rethink the position based on lock counts, flank if one side is already overloaded

    var frontLockCount = this.getLockCount(target.id, jc.orient.front);
    var backLockCount = this.getLockCount(target.id, jc.orient.behind);


    if (position == jc.orient.front && frontLockCount >=2 ){
        position = 'behind';
    }

    if (position == jc.orient.behind && backLockCount >=2 ){
        position = 'front';
    }

    var supportPos;
    if (position == jc.orient.front){
        //if my target is flip x and i am supposed to be infront of them, that means
        //I need to position myself to their right, ortherwise left
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x - this.getMaxWidth(), toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x + this.getMaxWidth(), toPoint.y);
        }

        //augment the y of my position base
        if (frontLockCount == 1){
            supportPos.y += 25 * jc.characterScaleFactor;
        }

        if (frontLockCount == 2){
            supportPos.y -= 25 * jc.characterScaleFactor;
        }

    }

    if (position == jc.orient.behind){
        //if my target is flip x and i am supposed to be behind of them, that means
        //I need to position myself to their left, otherwise right
        if (target.isFlippedX()){
            supportPos = cc.p(toPoint.x + this.getMaxWidth(), toPoint.y);
        }else{
            supportPos = cc.p(toPoint.x - this.getMaxWidth(), toPoint.y);
        }

        if (backLockCount == 1){
            supportPos.y += 25 * jc.characterScaleFactor;
        }

        if (backLockCount == 2){
            supportPos.y -= 25 * jc.characterScaleFactor;
        }
    }

    return {position:position, facing:facing, supportPos:supportPos};
}

GeneralBehavior.prototype.orient = function(position, facing, target){

    if (!target){
        return this.owner.getBasePosition();
    }

    this.lockPosition = this.getPositionalData(position, facing, target);

    //if I am to face the character and I am in front of them, I need to be the opposite flipx
    if (this.lockPosition.facing == jc.orient.facing && this.lockPosition.position == jc.orient.front){
        this.owner.setFlippedX(!target.isFlippedX())
    }

    //if I am to face the character and i am behind them I need to be the same flipx
    if (this.lockPosition.facing == jc.orient.facing && this.lockPosition.position == jc.orient.behind){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am front of them I need to be same flipx
    if (this.lockPosition.facing == jc.orient.away && this.lockPosition.position == 'font'){
        this.owner.setFlippedX(target.isFlippedX())
    }

    //if I am NOT to face the character and i am behind them of them I need to be opposite flipx
    if (this.lockPosition.facing == jc.orient.away && this.lockPosition.position == jc.orient.behind){
        this.owner.setFlippedX(!target.isFlippedX())
    }

    return this.lockPosition.supportPos;

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

GeneralBehavior.prototype.commonThink = function(dt,selected){
    this.collectTextureWidth();
    var state= this.getState();
    this.handleDeath();
    if (!this.timeLocked ){
        this.timeLocked = 0;
    }else{
        if (this.locked){
            this.timeLocked +=dt;
        }
    }

    if (selected){
        if (!this.forceLocked && state.brain != 'followUserCommand' && !this.forceSupport){
            return;
        }
    }
    return state;
}

GeneralBehavior.prototype.handleState = function(dt, selected){

    var state = this.commonThink(dt,selected);
    if (!state){
        return;
    }


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
    }else{
        if (this.forceLocked && !this.locked.isAlive()){
            this.forceLocked = false;
            this.locked = false;
        }
    }

    switch(state.brain){
        case 'idle':this.handleIdle(dt);
            break;
        case 'fighting':this.handleFight(dt);
            break;
      case 'move':this.handleIdle(dt);
            break;
      case 'special':this.handleSpecial(dt);
            break;
    }
    this.afterEffects();
}


GeneralBehavior.prototype.handleSpecial = function(dt){
    var state = this.getState();
    if (state.anim != "special"){
        this.setState('idle', 'idle');
    }
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


    if (this.forceLocked){
        return;
    }

    if (this.locked && this.damager && this.locked!=this.damager){ //if im being attacked and I'm locked, and they are not the same person
        var closer = this.whosCloser(this.locked, this.damager);
        if (closer == 1){
            this.damager = undefined; //stop worrying about damage, stay on target
        }

        if (closer == -1){ //switch targets
            this.setLock(this.damager);
            this.damager = undefined;
        }
    }

    if (!this.locked){
        this.forceLocked = false;
        this.lockOnClosest(this.targetUnlocked.bind(this), this.owner.otherteam);
    }

    if (this.locked && !this.withinRadius(this.locked.getBasePosition())){
        if (this.timeLocked > this.indecisionFactor){
            this.lockOnClosest(this.targetUnlocked.bind(this), this.owner.otherteam);
        }
    }

    if (this.locked && !this.locked.isAlive()){
        this.forceLocked = false;
        this.lockOnClosest(this.targetUnlocked.bind(this), this.owner.otherteam);
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


    if (this.owner.name == 'goblin'){
        console.log('break');
    }

    if (state.brain ==  'followUserCommand'){
        this.followUserCommand(dt);
        return;
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
        this.clearLock()
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
        this.setLock(target);
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

GeneralBehavior.prototype.setSupport = function(target){
    this.support = target;
}

GeneralBehavior.prototype.setLock = function(target, noMark){
    this.lazyInitLockTable();
    this.timeLocked = 0;
    this.locked = target;
    if (!noMark){
        jc.lockTable[this.owner.team][target.id] = this.owner.name + '-' + this.owner.id;
        this.lockPosition = this.getPositionalData(undefined, undefined, target);
        this.incrementLock();
    }
}

GeneralBehavior.prototype.incrementLock = function(){
    this.lazyInitLockCounts(this.locked, this.lockPosition.position);
    jc.lockCounts[this.owner.team][this.locked.id][this.lockPosition.position]++;

}

GeneralBehavior.prototype.decrementLock = function(){
    this.lazyInitLockCounts(this.locked, this.lockPosition.position);
    jc.lockCounts[this.owner.team][this.locked.id][this.lockPosition.position]--;
}

GeneralBehavior.prototype.lazyInitLockCounts = function(target, direction){
    if (jc.lockCounts[this.owner.team][target.id] == undefined){
        jc.lockCounts[this.owner.team][target.id] = {};
    }

    if (jc.lockCounts[this.owner.team][target.id][direction]){
        jc.lockCounts[this.owner.team][target.id][direction] = 0;
    }
}



GeneralBehavior.prototype.getLockCount = function(id, pos){
    this.lazyInitLockTable();

    if (!jc.lockCounts[this.owner.team][id]){
         return 0;
    }

    if (!jc.lockCounts[this.owner.team][id][pos]){
        return 0;
    }

    return jc.lockCounts[this.owner.team][id][pos];
}

GeneralBehavior.prototype.clearLock = function(){
    this.lazyInitLockTable();
    if (this.locked){
        jc.lockTable[this.owner.team][this.locked.id] = false;
        this.decrementLock();
        this.timeLocked=0;
    }
}

GeneralBehavior.prototype.targetUnlocked = function(target){
    this.lazyInitLockTable();
    var result = jc.lockTable[this.owner.team][target.id];
    if (result == undefined){
        return true;
    }else if (this.owner.name + '-' + this.owner.id == result){ //am I locked onto this, if so - its okay to stay locked
        return true;
    }
    return false;
}

GeneralBehavior.prototype.lazyInitLockTable = function(target){
    if (!jc.lockTable){
        jc.lockTable = {};
        jc.lockTable['a'] = {};
        jc.lockTable['b'] = {};
    }

    if (!jc.lockCounts){
        jc.lockCounts = {};
        jc.lockCounts['a'] = {};
        jc.lockCounts['b'] = {};
    }
}
