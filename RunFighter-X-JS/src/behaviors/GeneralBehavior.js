


var GeneralBehavior = cc.Node.extend({});


GeneralBehavior.prototype.state = function(){
    if (!this.brainState){
        this.brainState = 'idle';
    }
    return this.brainState;
}

//init
GeneralBehavior.prototype.init = function(sprite){
    this.owner = sprite;
    if (this.owner.targetRadius==undefined) throw "targetRadius not implemented on owning sprite.";
    if (this.owner.homeTeam==undefined) throw "homeTeam not implemented on owning sprite.";
    if (this.owner.enemyTeam==undefined) throw "enemyTeam not implemented on owning sprite.";
    this.directions = [0, 45, 90, 135, 180, 225, 270];
    this.owner = sprite;
    this.states = [];
}

//find a random opposing badguy
GeneralBehavior.prototype.lockOnAny = function(){
    var sprite = jc.randomNum(0, this.owner.enemyTeam.length-1);
    this.locked = this.owner.enemyTeam[sprite];
    return sprite;
}

//call lock on closest, but pass isUnlocked to check if anyone is locked on already, if so pass and check the next.
GeneralBehavior.prototype.lockOnClosestUnlocked = function(){
    return this.lockOnClosest(this.isUnlocked.bind(this));
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
GeneralBehavior.prototype.lockOnClosest = function(checkFunc){
    var currentlyLocked = undefined;
    var winSize = cc.Director.getInstance().getWinSize()
    var minDistance = winSize.width;
    for (var i =0; i< this.owner.enemyTeam.length; i++){
        var sprite = this.owner.enemyTeam[i];
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
    }else{ //right
        attackPosition = cc.p(toPoint.x + mySize.height, toPoint.y);
    }

    var vector = this.getVectorTo(attackPosition, myFeet);

    if (vector.xd < this.owner.targetRadius && vector.yd < this.owner.speed/2){
        return cc.p(0,0);
    }

    var speed = 0;
    if (this.owner.speed > vector.distance){
        speed = vector.distance; //slow down
    }else{
        speed = this.owner.speed;
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


GeneralBehavior.prototype.moveToward = function(point, dt){

    // Update position based on velocity
    var newPosition = cc.pAdd(this.owner.getBasePosition(), cc.pMult(point, dt));

    this.owner.setBasePosition(newPosition);

}

//high priority animation
GeneralBehavior.prototype.pushState = function(brainState, animationState){

    //save the old state
    this.states.push({
        brain:this.brainState,
        anim:this.animationState
    });
    //push the new state
    this.states.push({
        brain:brainState,
        anim:animationState
    });
    this.setState(); //make it happen asap
}

//animation that shouldn't be forgotten but is not priority
GeneralBehavior.prototype.queueState = function(brainState, animationState){
    this.states.unshift({
            brain:brainState,
            anim:animationState
    });
}

GeneralBehavior.prototype.setState = function(){
    var state = this.states.pop();
    if (!state){
        state = {
            brain:'idle',
            anim:'idle'
        }
    }
    var brainState = state.brain;
    var animationState = state.anim;

    if(brainState){
        this.brainState = brainState;
    }


    if (animationState){
        this.animationState = animationState;
        if (animationState){
            this.owner.setState(this.animationState, function(){
                this.setState(); //go to next state
            }.bind(this));
        }
    }
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

GeneralBehavior.prototype.scheduleDamage=function(amount, time){
    this.owner.scheduleOnce(function(){
        this.owner.addDamage(amount);
        if (this.owner.isAlive()){
            this.pushState('damage', 'damage');
        }else{
            this.pushState('dead', 'dead');
        }
    }.bind(this,amount),time);



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