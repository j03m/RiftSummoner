


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

//sets a state
GeneralBehavior.prototype.setState = function(brainState, animationState){
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

    if (vector.xd < this.owner.gameObject.targetRadius && vector.yd < this.owner.gameObject.speed/2){
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
        this.locked.behavior.setState(undefined, 'damage'); //damage shouldn't interupt whatever is happening.
    }

}