var PanZoomTest = jc.WorldLayer.extend({
    init: function() {
        if (this._super(shrine1Png)) {
            this.firstTouch = true;
            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler:function(type, touch){
        if (type == jc.touchEnded && this.firstTouch){
            //this.fullZoomOut(jc.defaultTransitionTime,function(){
//            this.panToWorldPoint(cc.p(900,900), this.getScale8x(), jc.defaultTransitionTime, function(){
//               this.firstTouch = false;
//            }.bind(this));
        }else if (type == jc.touchEnded && !this.firstTouch){
            console.log(touch);
            var world = this.screenToWorld(touch);
            console.log(world);
            var screen = this.worldToScreen(world)
            console.log(screen);
            //screen to world
//            var world = this.screenToWorld(touch)
//            console.log(world);
//            console.log(this.worldToScreen(world))
        }

    }
});

PanZoomTest.create = function() {
    var ml = new PanZoomTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

PanZoomTest.scene = function() {
    if (!jc.panZoomTest){
        jc.panZoomTest = cc.Scene.create();
        jc.panZoomTest.layer = PanZoomTest.create();
        jc.panZoomTest.addChild(jc.panZoomTest.layer);
    }
    return jc.panZoomTest;

};