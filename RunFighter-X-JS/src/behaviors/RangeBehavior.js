var RangeBehavior =  function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
}


RangeBehavior.prototype.think = function(dt){

    //if I'm not locked on, lock on
    if (this.getState() == 'dead' || !this.owner.isAlive()){
        return;
    }


    if (this.state() == 'flee'){
        //pick a spot away from things
        this.locked = undefined;
        if (!this.fleePoint){
            this.fleePoint = this.getRandomFleePosition();
        }
        var seekPoint = this.seek(this.fleePoint);
        if (seekPoint.x==0 && seekPoint.y==0){
            this.setState('idle');
            return;
        }else{
            this.moveToward(this.fleePoint, dt);
        }
    }

    if (!this.locked || !this.locked.isAlive()){
        this.locked = this.lockOnClosestUnlocked();
        if (!this.locked){
            this.locked = this.lockOnClosest();
        }
        this.setState('idle');
        if (!this.locked){
            return;
        }

    }

    if  (this.state() == 'attack'){ //todo: replace with isAttacking to cover all possible attack states
        //let attack finish
        return;
    }

    if (this.state() == 'idle' || this.state() == 'move'){
        //set state to moving
        //update our sprites animation to move
        this.setState('move');

        var point = this.seek();  //todo: if seek is 0,0 - attack
        if (point.x==0 && point.y==0){
            if (!this.owner.once){
                this.setState('attack', 'attack');
                this.locked.scheduleDamage(this.owner.damage, this.owner.strikeTime);
            }
        }else{
            this.moveToward(point, dt);
        }
    }



    if (this.state() == 'damage'){
        //get out of there
        this.setState('flee', 'idle');
    }
}







