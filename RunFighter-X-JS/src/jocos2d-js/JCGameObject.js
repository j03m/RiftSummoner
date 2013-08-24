jc.GameObject = function(){
    this.gameQueue = [];
    this.resourceQueue = [];
    jc.log(['requestManager'], 'scheduling updates');
    cc.Director.getInstance().getScheduler().scheduleCallbackForTarget(this, this.worker, .01);

}
