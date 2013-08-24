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
        this.setState('idle', 'idle');
        if (!this.locked){
            return;
        }

    }

    if (this.state() == 'idle' || this.state() == 'move'){
        //set state to moving
        //update our sprites animation to move
        this.setState('move', 'move');

        var point = this.seekEnemy();  //todo: if seek is 0,0 - attack
        if (point.x==0 && point.y==0){
            this.doAttack();
        }else{
            this.moveToward(point, dt);


            //modify landing so that if two sprites are lock on each other, they do a sort of square off.

            //if the sprite im locked onto is locked squared on someone else, find open space in what we'll call the attack radius

            //attack radius is a place where i am visible and not in anyone elses bounding box



        }
    }
}







