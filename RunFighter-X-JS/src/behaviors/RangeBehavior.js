var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);

    this.handleIdle = this.handleRangeIdle;
    this.handleFight = this.handleRangeFight;
    this.withinRadius= this.withinRangeRadius;

}


RangeBehavior.prototype.handleRangeFight = function(dt){

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
    var effectDelay = this.owner.gameObject.effectDelays['attack'];

    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        this.setAttackAnim('fighting');
        console.log("missile scheduled");
        this.owner.scheduleOnce(this.doMissile.bind(this),effectDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

RangeBehavior.prototype.doMissile = function(){

    //make missile sprite
    console.log("missile sent");
    var missileName = this.owner.gameObject.missile;
    if (!missileName){
        missileName = "greenbullet"; //todo temp, remove
    }

    var missileType = missileConfig[missileName];
    var vector = this.getVectorTo(this.locked.getBasePosition(), this.owner.getBasePosition());
    var timeToImpact = vector.distance/missileType.speed;
    var missile = jc.makeSpriteWithPlist(missileType.plist, missileType.png, missileType.start);
    var missileAnimation = jc.makeAnimationFromRange(missileName, missileType );

    //start it in front of me
    this.owner.layer.addChild(missile);
    var ownerPos = this.owner.getBasePosition();
    var tr = this.owner.getTextureRect();
    if (this.owner.isFlippedX()){
        ownerPos.x -=tr.width/2;
    }else{
        ownerPos.x +=tr.width/2;
    }

    ownerPos.y += tr.height/2;

    if (missileType.offset){
        ownerPos = cc.pAdd(ownerPos, missileType.offset);
    }


    missile.setFlipX(this.owner.isFlippedX());

    missile.setPosition(ownerPos);
    missile.runAction(missileAnimation);

    //move it to the target at damageDelay speed
    var moveTo = cc.MoveTo.create(timeToImpact, this.locked.getPosition());
    var callback = cc.CallFunc.create(function(){
        this.hitLogic();
        this.owner.layer.removeChild(missile);
        if (this.locked){
            jc.playEffect(missileType.effect, this.locked,this.locked.getZOrder(), this.owner.layer);
        }


    }.bind(this));
    var seq = cc.Sequence.create(moveTo, callback);
    missile.runAction(seq);

}

RangeBehavior.prototype.handleRangeIdle = function(dt){
    //always lock on who-ever is closest
    this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam);

    if (this.locked){
        this.setState('move', 'move');
    }

}

RangeBehavior.prototype.withinRangeRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadius());
}










