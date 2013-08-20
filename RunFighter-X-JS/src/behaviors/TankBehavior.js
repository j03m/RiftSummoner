var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior(sprite));
    this.targetRadius=5;
    this.slowRadius=this.targetRadius + 25;
    this.timeToTarget=0.1;
    this.init();
}


TankBehavior.prototype.think = function(dt){

    //if I'm not locked on, lock on
    if (!this.locked){
        this.lockOnAny();

        //todo as sub behaviors:

        //this.lockOnClosest(); //aka closestEnemyToGameObject
        //this.lockOnHatred();
        //this.lockOnStrongest();
    }

    if  (this.state() == 'attack'){ //todo: replace with isAttacking to cover all possible attack states
        //let attack finish
    }

    if (this.state() == 'idle' || this.state() == 'move'){
        //set state to moving
        //update our sprites animation to move
        this.owner.setState('move');

        var seekAccel = this.seek();  //todo: if seek is 0,0 - attack
        if (seekAccel.x==0 && seekAccel.y==0){
            //plant and attack
            this.owner.setState('attack');
        }else{
            var separateAccel = this.separate();
            this.moveToward(seekAccel, separateAccel, dt);
        }
    }
}







