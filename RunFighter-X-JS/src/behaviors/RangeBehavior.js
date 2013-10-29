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

    if (this.lastAttack==undefined){
        this.lastAttack = actionDelay;
    }

    //if time is past the actiondelay and im not in another animation other than idle or damage
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1){
        this.setAttackAnim('fighting');
        this.doMissile();
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

RangeBehavior.prototype.doMissile = function(){
    var damageDelay = this.owner.gameObject.effectDelays['attack'];

    //make missile sprite
    var missleName = this.owner.gameObject.missile;

    var missileType = missileConfig[this.owner.gameObject.missile];
    var missile = jc.makeSpriteWithPlist(missileType.plist, missileType.png, missileType.start);
    var missileAnimation = jc.makeAnimationFromRange(missleName, missileType );

    //start it in front of me
    this.owner.layer.addChild(missile);
    var ownerPos = this.owner.getBasePosition();
    if (missileType.offset){
        ownerPos = cc.pAdd(ownerPos, missileType.offset);
    }


    missile.setFlipX(this.owner.isFlippedX());

    missile.setPosition(ownerPos);
    missile.runAction(missileAnimation);

    //move it to the target at damageDelay speed
    var moveTo = cc.MoveTo.create(damageDelay, this.locked.getPosition());
    var callback = cc.CallFunc.create(function(){
        this.hitLogic();
        this.owner.layer.removeChild(missile);
        jc.playEffect(missileType.effect, this.locked.getPosition(),this.locked.getZOrder(), this.owner.layer);

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










