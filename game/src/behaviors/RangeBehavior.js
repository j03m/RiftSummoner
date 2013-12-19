var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);

    this.handleIdle = this.handleRangeIdle;
    this.handleFight = this.handleRangeFight;
    this.withinRadius= this.withinRangeRadius;

}


RangeBehavior.prototype.handleRangeFight = function(dt){

    //is anyone closer?
    if (!this.forceLocked){
        this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam());
    }

    //is my target alive?
    var state= this.getState();
    if (!this.locked){
        this.setState('idle', state.anim);
        return;
    }

    if (!this.locked.isAlive()){
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
    var state = this.getState();
    if (this.lastAttack >= actionDelay && state.anim.indexOf('attack')==-1 && !this.firing){
        this.setAttackAnim('fighting');
        this.owner.scheduleOnce(this.doMissile.bind(this),effectDelay);
        this.lastAttack = 0;
    }else{
        this.lastAttack+=dt;
    }
}

RangeBehavior.prototype.doMissile = function(){
    if (!this.locked){
        return;
    }
    //make missile sprite
    if (!this.firing){ //do missile

        this.firing = true;
        var missileName = this.owner.gameObject.missile;
        if (!missileName){
            missileName = "greenbullet"; //todo temp, remove
        }

        var missileType = missileConfig[missileName];
        var vector = this.getVectorTo(this.locked.getBasePosition(), this.owner.getBasePosition());
        var timeToImpact = vector.distance/missileType.speed;
        if (!this.missile){
            jc.log(['rangeBehavior'], 'Animating: ' + this.owner.name + ' missle: ' + missileName);
            if (missileType.simple){
            	this.missile = jc.makeSpriteFromFile(missileType.png);
            }else{
				this.missile = jc.makeSpriteWithPlist(missileType.plist, missileType.png, missileType.start);
	            this.missileAnimation = jc.makeAnimationFromRange(missileName, missileType );
	            this.missile.runAction(this.missileAnimation);            	
            }
            this.missile.setFlippedX(this.owner.isFlippedX());


        }

        this.owner.layer.addChild(this.missile);
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

        if (this.owner.gameObject.missileOffset){
            ownerPos = cc.pAdd(ownerPos, this.owner.gameObject.missileOffset);
        }

        this.missile.setPosition(ownerPos);


        //move it to the target at damageDelay speed
        var targetPos;
        if (this.owner.gameObject.missleTarget == "base"){
            targetPos = this.locked.getBasePosition()
        }else{
            targetPos = this.locked.getBasePosition();
            var targetTr = this.locked.getTextureRect();
            targetPos.y += targetTr.height/2;
        }

		
        var moveTo;
        var rotateTo;
        var missileStart = this.missile.getPosition();
        var v = this.getVectorTo(targetPos, missileStart);
		if (!missileType.path){
			moveTo = cc.MoveTo.create(timeToImpact, targetPos);			
		}else if (missileType.path=="bezier"){
			
			var bezier = [];
			bezier.push(missileStart);

			var pos2 = cc.pMidpoint(missileStart, targetPos);
			pos2.y += v.distance/2;
			bezier.push(pos2);
			
			bezier.push(targetPos);				
			moveTo = cc.BezierTo.create(timeToImpact, bezier);
		}else if (missileType.path =="jump"){
			moveTo = cc.JumpTo.create(timeToImpact, targetPos, v.distance/2, 1);
		}else if (missileType.path =="arrow"){

            moveTo = cc.JumpTo.create(timeToImpact, targetPos,v.distance/3 , 1);
        }

        if (missileType.rotation){
            //todo: set initial angel - based on sprite direction
            if (this.owner.isFlippedX()){
                this.missile.setRotation(missileType.initialAngle *-1);
                rotateTo = cc.RotateTo.create(timeToImpact, -45);
            }else{
                this.missile.setRotation(missileType.initialAngle);
                rotateTo = cc.RotateTo.create(timeToImpact, 45);
            }


        }


        var callback = cc.CallFunc.create(function(){

            if (this.locked){
                this.hitLogic();
                if (missileType.effect){
                    jc.playEffectOnTarget(missileType.effect, this.locked, this.owner.layer);
                }
            }
            this.owner.layer.removeChild(this.missile, false);
            this.firing = false;

        }.bind(this));
        var seq = cc.Sequence.create(moveTo, callback);
        this.missile.runAction(seq);
        if (rotateTo){
            this.missile.runAction(rotateTo);
        }


    }else{
        //make sure I'm not attacking
        var state = this.getState();
        this.setState(state.brain, 'idle');
    }

}

//RangeBehavior.prototype.strikeSuccess = function(){
//    var mbb = this.missile.getBoundingBox();
//    mbb.width*=2;
//    var tbb = this.locked.getBoundingBox();
//
//    if (cc.rectContainsRect(tbb, mbb)){
//        jc.log(['console'], this.owner.name + " hit " + this.locked.name);
//        return true;
//    }else{
//        jc.log(['console'], this.owner.name + " missed " + this.locked.name);
//        return false;
//    }
//}

RangeBehavior.prototype.handleRangeIdle = function(dt){
    //always lock on who-ever is closest
    this.locked = this.lockOnClosest(undefined, this.owner.enemyTeam());

    if (this.locked){
        this.setState('move', 'move');
    }

}

RangeBehavior.prototype.withinRangeRadius = function(toPoint){
    return this.withinThisRadius(toPoint, this.owner.getTargetRadius(), this.owner.getTargetRadius());
}










