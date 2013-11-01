var Loading = jc.UiElementsLayer.extend({
    init: function(assets, nextScene) {
        this.assets = assets;
        this.nextScene = nextScene;
        if (this._super()) {
            cc.Loader.preload(assets, function(){
                jc.mainScene.layer.changeScene(this.nextScene);
            }.bind(this));
            this.schedule(this.checkPercent);
            return true;
        } else {
            return false;
        }
    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        var loader = cc.Loader.getInstance();
        console.log(loader.getPercentage() + " done...");

    }
});



Loading.scene = function(assets, nextScene) {

    var scene = cc.Scene.create();
    var layer = new Loading();
    scene.addChild(layer);
    layer.init(assets, nextScene);
    return scene
};
