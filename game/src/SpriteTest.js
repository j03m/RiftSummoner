var SpriteTest = cc.Layer.extend({
    init: function() {
        if (this._super()) {
            cc.TextureCache.getInstance().addImageAsync(s_spineboy, this, this.loadSpineTest);
            return true;
        } else {
            return false;
        }
    },
    loadSpineTest: function () {

        var ccSkelNode = cc.SkeletonAnimation.createWithFile(s_spineboyJSON, s_spineboyATLAS);

        ccSkelNode.skeleton.setSlotsToSetupPose();
        ccSkelNode.setMix("walk", "jump", 0.2);
        ccSkelNode.setMix("jump", "walk", 0.4);

        ccSkelNode.setAnimation("walk", true);

        ccSkelNode.skeleton.getRootBone().x = 0;
        ccSkelNode.skeleton.getRootBone().y = 0;

        ccSkelNode.updateWorldTransform();
        ccSkelNode.setPosition(cc.p(320, 5));

        this.addChild(ccSkelNode);

        this.removeChild(this._labelLoading, true);
    }
});

SpriteTest.create = function() {
    var ml = new SpriteTest();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
};

SpriteTest.scene = function() {
    var scene = cc.Scene.create();
    var layer = SpriteTest.create();
    scene.addChild(layer);
    return scene;
};
