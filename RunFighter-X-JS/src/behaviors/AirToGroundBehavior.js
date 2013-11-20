
var AirToGroundBehavior = function(sprite){
    _.extend(this, new GeneralBehavior());
    this.handleTankIdle = this.handleIdle;
    this.handleIdle = this.handleA2GIdle;
    this.init(sprite);
}

//seeks ground units like a tank
//floats at a higher position then the target at all times 45 degree angle
//then shoots down with each attack
//only targettable by range and air2air

//add drop shadow to all sprites


//AirToGroundBehavior.prototype.








