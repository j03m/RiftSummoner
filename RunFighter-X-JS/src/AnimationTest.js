var Consts = {};
Consts.idle=0;
Consts.walk=1;
Consts.attack=2;
Consts.intro=2;
Consts.dead=3;
Consts.powerup=4;

var AnimationTest = jc.TouchLayer.extend({

    init: function() {
        if (this._super()) {

            this.sprite = jc.Sprite.spriteGenerator(spriteDefs, "blueKnight", this);
            this.addChild(this.sprite);
            this.sprite.setBasePosition(cc.p(this.winSize.width/2, this.winSize.height/2));
            this.sprite.setState('attack');
            this.bubbleAllTouches(true);
            return true;
        } else {
            return false;
        }
    },
    targetTouchHandler:function(type, touch, sprites){
        this.sprite.setState('attack2');
    }
});

AnimationTest.create = function() {
    var ml = new AnimationTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

AnimationTest.scene = function() {

    var scene = cc.Scene.create();
    var layer = AnimationTest.create();
    scene.addChild(layer);
    return scene;

};
