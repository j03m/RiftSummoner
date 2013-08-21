var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior(sprite));
    this.targetRadius=5;
    this.slowRadius=this.targetRadius + 25;
    this.timeToTarget=0.1;
    this.init();
}


TankBehavior.prototype.think = function(dt){

    //if I'm not locked on, lock on


    this.lockOnClosestUnlocked();


    if  (this.state() == 'attack'){ //todo: replace with isAttacking to cover all possible attack states
        //let attack finish
    }

    if (this.state() == 'idle' || this.state() == 'move'){
        //set state to moving
        //update our sprites animation to move
        this.owner.setState('move');

        var seekDesc = this.seek();  //todo: if seek is 0,0 - attack
        if (seekDesc.acceleration.x==0 && seekDesc.acceleration.y==0){
            //plant and attack
            this.owner.setState('attack');
        }else{
            var separateAccel = this.separate();
            this.moveToward(seekDesc.acceleration, separateAccel, dt, seekDesc.lineUp);


            //modify landing so that if two sprites are lock on each other, they do a sort of square off.

            //if the sprite im locked onto is locked squared on someone else, find open space in what we'll call the attack radius

            //attack radius is a place where i am visible and not in anyone elses bounding box



        }
    }
}







