var FlankerBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.init(sprite);
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleFlankerIdle;
}


FlankerBehavior.prototype.handleFlankerIdle = function(dt){
    if (!this.locked){
        this.locked = this.lockOnClosestNonTank();
    }else{
        this.handleTankIdle(dt);
    }

    if (this.locked && !this.locked.isAlive()){
            this.locked = undefined;
            this.locked = this.lockOnClosestNonTank();
    }else{
        this.handleTankIdle(dt);
    }

    if (!this.locked){
        return; //wait
    }else{
        this.setState('move', 'move');
    }
}