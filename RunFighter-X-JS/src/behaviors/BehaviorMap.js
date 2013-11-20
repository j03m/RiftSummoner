
var BehaviorMap = {
    'tank':TankBehavior
    ,'range':RangeBehavior
    ,'healer':HealerBehavior //supports a tank, if not supports a range
    ,'flanker':FlankerBehavior //b-lines for a non-tank
    ,'defender':DefenderBehavior  //defends a non-tank till death
    //,'airtoground':AirToGroundBehavior //flying tank that can be deadly to ground units
}
