//todo: remove
//var transition = cc.TransitionSlideInR.create(EditDeck.scene, 2);
//cc.Director.getInstance().replaceScene(transition);
//return;

var MainGame = cc.Layer.extend({
    state: 0,
    init: function() {
        if (this._super()) {
            return true;
        } else {
            return false;
        }
    },
    changeScene:function(key, metaData){         //todo: change to layer manager
        switch(key){
            case 'editdeck':
                //var transition = cc.TransitionSlideInR.create(0.2,ArenaGame.scene());
                cc.Director.getInstance().replaceScene(ArenaGame.scene());
                break;
            case 'arena':
                var transition = cc.TransitionSlideInR.create(0.2,ArenaGame.scene());
                cc.Director.getInstance().replaceScene(transition);
                break;
        }
    },
    onEnter:function(){
        this.changeScene('editdeck');
    }

});

MainGame.create = function() {
    var ml = new MainGame();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

MainGame.scene = function() {
    if (!jc.mainScene){
        jc.mainScene = cc.Scene.create();
        jc.mainScene.layer = MainGame.create();
        jc.mainScene.addChild(jc.mainScene.layer );
    }
    return jc.mainScene;
};