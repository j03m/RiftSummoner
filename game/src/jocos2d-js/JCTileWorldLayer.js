var jc = jc || {};
jc.TileWorldLayer = jc.TouchLayer.extend({
    init: function(worldMap) {
        //init tilemap

    }
});


jc.TileWorldLayer.create = function() {
    var ml = new jc.TileWorldLayer();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

jc.TileWorldLayer.scene = function() {
    if (!jc.mainScene){
        jc.mainScene = cc.Scene.create();
        jc.mainScene.layer = jc.TileWorldLayer.create();
        jc.mainScene.layer.retain();
        jc.mainScene.addChild(jc.mainScene.layer);
    }
    hotr.changeScene = hotr.mainScene.layer.changeScene.bind(hotr.mainScene.layer);
    return hotr.mainScene;
};