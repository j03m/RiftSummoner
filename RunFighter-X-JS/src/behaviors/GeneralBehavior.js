


var GeneralBehavior = function(sprite){
    if (!sprite){
        throw "behaviors need an owner, supply a game object";
    }
    this.owner = sprite;
}


GeneralBehavior.prototype.state = function(){
    return this.owner.getState();
}

//init
GeneralBehavior.prototype.init = function(){
    if (this.owner.slowRadius==undefined) throw "slowradius not implemented on owning sprite.";
    if (this.owner.maxVelocity==undefined) throw "maxVelocity not implemented on owning sprite.";
    if (this.owner.maxAcceleration==undefined) throw "maxAcceleration not implemented on owning sprite.";
    if (this.owner.velocity==undefined) throw "velocity not implemented on owning sprite.";
    if (this.owner.targetVelocity==undefined) throw "targetVelocity not implemented on owning sprite.";
    if (this.owner.targetRadius==undefined) throw "targetRadius not implemented on owning sprite.";
    if (this.owner.homeTeam==undefined) throw "homeTeam not implemented on owning sprite.";
    if (this.owner.enemyTeam==undefined) throw "enemyTeam not implemented on owning sprite.";
    if (this.owner.acceleration==undefined) throw "acceleration not implemented on owning sprite.";
}

//find a random opposing badguy
GeneralBehavior.prototype.lockOnAny = function(){
    var sprite = jc.randomNum(0, this.owner.enemyTeam.length-1);
    this.locked = this.owner.enemyTeam[sprite];
    return sprite;
}

//lock onto the closest bad guy but use the check function for exceptions
GeneralBehavior.prototype.lockOnClosest = function(checkFunc){
    var currentlyLocked = undefined;
    var winSize = cc.Director.getInstance().getWinSize()
    var minDistance = winSize.width;
    for (var i =0; i< this.owner.enemyTeam.length; i++){
        var sprite = this.owner.enemyTeam[i];
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

    if (currentlyLocked == undefined){
        throw "couldn't lock on - something is wrong am the big winner?";
    }

    this.locked = currentlyLocked;
    return this.locked;
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    this.lockOnClosest(this.isUnlocked.bind(this));
}
//todo as sub behaviors:
//this.lockOnHatred();
//this.lockOnStrongest();
//this.lockOnAir
//this.lockOnRange
//this.lockOnSupport

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

GeneralBehavior.prototype.seek = function(){
    var timeToTarget = 0.1; //move to sprite?
    if (!this.locked){
        throw "invalid state, character must be locked to seek.";
    }

    if (!this.owner){
        throw "Owning game object required";
    }

    var targetSpeed = 0;
    if (this.owner.slowRadius == undefined ||  this.owner.maxVelocity == undefined){
        throw "Owning game object must have slowRadius, targetSpeed and maxVelocity properties";
    }

    var myFeet = this.owner.getBasePosition();
    var enemyFeet = this.locked.getBasePosition();
    var vector = this.getVectorTo(enemyFeet, myFeet);
    var distance = vector.distance;
    var direction = vector.direction;
    var lineUp = false;
    if (distance < this.owner.targetRadius) {
       // if (myFeet.y == enemyFeet.y){
            this.owner.velocity = cc.p(0,0);  //CGPointZero? This correct?
            this.owner.acceleration = cc.p(0,0);
            return {lineUp:false, acceleration:cc.p(0,0)};
//        }else{
//            //go into lineup mode
//            lineUp = true;
//        }
    }

    if (distance > this.owner.slowRadius) {
        targetSpeed = this.owner.maxVelocity;
    } else {
        targetSpeed = this.owner.maxVelocity * distance / this.owner.slowRadius;
    }

    this.owner.targetVelocity = cc.pMult(cc.pNormalize(direction), targetSpeed);
    var acceleration = cc.pMult(cc.pSub(this.owner.targetVelocity, this.owner.velocity), 1/timeToTarget);
    if (cc.pLength(acceleration) > this.owner.maxAcceleration) {
        acceleration = cc.pMult(cc.pNormalize(acceleration), this.owner.maxAcceleration);
    }
    return {lineUp:lineUp, acceleration:acceleration};

}

GeneralBehavior.prototype.getVectorTo= function(to, from){
    if (!to || !from){
        throw "To and From positions required!";
    }
    var direction = cc.pSub(to,from);
    var distance = cc.pLength(direction);
    return {direction:direction, distance:distance};
}

GeneralBehavior.prototype.separate = function(){
    var steering = cc.p(0,0);
    var allies = this.owner.getAllies();
    for (var i =0; i< allies.length; i++) {
        if (allies[i] != this.owner){
            var ally = allies[i];
            var direction = cc.pSub(this.owner.getBasePosition(), ally.getBasePosition());
            var distance = cc.pLength(direction);
            var SEPARATE_THRESHHOLD = 300;

            if (distance < SEPARATE_THRESHHOLD) {
                direction = cc.pNormalize(direction);
                steering = cc.pAdd(steering, cc.pMult(direction, this.owner.maxAcceleration));
            }
        }
    }
    return steering;
}


GeneralBehavior.prototype.moveToward = function(seekAccel, separateAccel, dt, lineUp){
    var newAcceleration = cc.pAdd(seekAccel, separateAccel);
    this.owner.acceleration = cc.pAdd(this.owner.acceleration, newAcceleration);
    if (cc.pLength(this.owner.acceleration) > this.owner.maxAcceleration) {
        this.owner.acceleration = cc.pMult(cc.pNormalize(this.owner.acceleration), this.owner.maxAcceleration);
    }

    // Update current velocity based on acceleration and dt, and clamp
    this.owner.velocity = cc.pAdd(this.owner.velocity, cc.pMult(this.owner.acceleration, dt));
    if (cc.pLength(this.owner.velocity) > this.owner.maxVelocity) {
        this.owner.velocity = cc.pMult(cc.pNormalize(this.owner.velocity), this.owner.maxVelocity);
    }

    // Update position based on velocity
    var newPosition = cc.pAdd(this.owner.getBasePosition(), cc.pMult(this.owner.velocity, dt));
    var winSize = cc.Director.getInstance().getWinSize()
    if (!lineUp){ //if lineup mode == true, only modify our y position
        newPosition.x = Math.max(Math.min(newPosition.x, winSize.width), 0);
    }
    newPosition.y = Math.max(Math.min(newPosition.y, winSize.height), 0);
    this.owner.setBasePosition(newPosition);

}
