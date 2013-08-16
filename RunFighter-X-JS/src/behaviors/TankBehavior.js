var TankBehavior = function(sprite){
    _.extend(this, new GeneralBehavior(sprite));
    this.init();
}


TankBehavior.prototype.think = function(){

    //if I'm not locked on
    if (!this.locked){
        this.lockOnAny();

        //todo as sub behaviors:
        //this.lockOnClosest();
        //this.lockOnHatred();
        //this.lockOnStrongest();

        //move to position of bad guy
        this.owner.moveTo(this.locked.getPosition(), 'move',50);
    }

    //if I'm locked on

    //if
}




