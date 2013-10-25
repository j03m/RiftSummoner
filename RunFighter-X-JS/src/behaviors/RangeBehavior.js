var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);

    this.handleIdle = this.handleRangeIdle;
    this.handleFight = this.handleRangeFight;

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
    var missileAnimation = jc.makeAnimationFromRange(missileType.frames, missileType.delay,missleName );

    //start it in front of me
    this.owner.layer.addChild(missile);
    var ownerPos = this.owner.getBasePosition();
    var ownerRect = this.owner.getTextureRect();
    if (this.owner.isFlippedX()){
        ownerPos.x-=ownerRect.width/2;
    }else{
        ownerPos.x+=ownerRect.width/2;
    }
    ownerPos.y += ownerRect.height/2;
    missile.setFlipX(this.owner.isFlippedX());

    //adjust if needed
    var missleAdjustment = this.owner.gameObject.missleAdjust;
    if (missleAdjustment){
        ownerPos.x += missleAdjustment.x;
        ownerPos.y += missleAdjustment.y;
    }

    missile.setPosition(ownerPos);
    missile.runAction(missileAnimation);

    //move it to the target at damageDelay speed
    //when done, tell target to play effect
    //and destroy the sprite
    //this.owner.scheduleOnce(this.hitLogic.bind(this), damageDelay);


}

RangeBehavior.prototype.handleRangeIdle = function(dt){
    //always lock on who-ever is closest
    this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam);

    if (this.locked){
        this.setState('move', 'move');
    }

}












