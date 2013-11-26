var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var RetinaTest = cc.Layer.extend({
    init: function() {

        if (this._super()) {
            this.bg = jc.makeSpriteWithPlist(uiPlist, uiPng, "genericBackground.png");
            var winSize = cc.Director.getInstance().getWinSize();
            this.bg.setPosition(cc.p(winSize.width/2, winSize.height/2));
            this.addChild(this.bg);
            return true;
        } else {
            return false;
        }
    }


});

RetinaTest.create = function() {
    var ml = new RetinaTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

RetinaTest.scene = function() {

    var scene = cc.Scene.create();
    var layer = RetinaTest.create();
    scene.addChild(layer);
    jc.RetinaTest = layer;
    return scene;

};
