var PanZoomTest = jc.WorldLayer.extend({
    init: function() {
        if (this._super(shrine1Png)) {
           // this.setViewCenter(cc.p(0,0));
            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler:function(type){
        if (type == jc.touchEnded){
            this.fullZoomOut(1,function(){
                console.log(" ZOOM OUT DONE! ")
                this.panToWorldPoint(cc.p(this.worldSize.width,this.worldSize.height), jc.defaultTransitionTime, function(){
                    console.log(" PAN DONE! ");
                }.bind(this));
                this.fitTo(this.worldSize.width/4, this.worldSize.height/4,jc.defaultTransitionTime, function(){
                    console.log(" ZOOM IN DONE! ");
                    this.panToWorldPoint(cc.p(0,0), jc.defaultTransitionTime, function(){  });
                }.bind(this));
            }.bind(this));
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