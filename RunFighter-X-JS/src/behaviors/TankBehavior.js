var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.stateMap
}

TankBehavior.prototype.think = function(dt){

    //if I'm not locked on, lock on
    if (this.state() == 'dead' || !this.owner.isAlive()){
        return;
    }

    if  (this.state() == 'attack'){ //todo: replace with isAttacking to cover all possible attack states
        //let attack finish
        return;
    }

    if (!this.locked || !this.locked.isAlive()){
        this.locked = this.lockOnClosestUnlocked();
        if (!this.locked){
            this.locked = this.lockOnClosest();
        }
        //push idle, force idle
        if (!this.locked){
            this.pushState('idle', 'idle');
            return;
        }

    }

    if (this.state() == 'idle' || this.state() == 'move'){
        //set state to moving
        //update our sprites animation to move
        this.pushState('move', 'move');

        var point = this.seekEnemy();  //todo: if seek is 0,0 - attack
        if (point.x==0 && point.y==0){
            this.pushState('attack', 'attack');
            var effectDelay = this.owner.effectDelays['attack'];
            this.scheduleDamage(this.owner.damage, effectDelay);
        }else{
            this.moveToward(point, dt);
        }
    }
}







