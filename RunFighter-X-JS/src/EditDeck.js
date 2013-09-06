var playerBlob = {
    id:1,
    grid:[]
}

var EditDeck = jc.TouchLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    init: function() {
        if (this._super()) {
            var sprites = this.getChildren();
            var cardCount = 0;
            for (var i =0; i<sprites.length;i++) {
                if (sprites[i].getTag() == -2){ //-2 is added in cocosbuilder and indicates a card
                    this.cards['card' + cardCount] = sprites[i];
                    this.touchTargets.push(sprites[i]);
                }
            }
            this.wireInput();
            this.wireChildren();
            return true;
        } else {
            return false;
        }
    }
});

EditDeck.create = function() {
    var ml = new EditDeck();
    if (ml && ml.init(playerBlob)) { //todo: dear joe, if you forget to replace this, the game won't be much fun.
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

EditDeck.scene = function() {
    if (!jc.editDeckScene){
        jc.editDeckScene = cc.Scene.create();
        cc.BuilderReader.setResolutionScale(1);
        jc.editDeckScene.layer = cc.BuilderReader.load("EditDeck.ccbi");
        var editDeck = new EditDeck();
        var finalScene = jc.inherit(editDeck,jc.editDeckScene.layer);
        jc.editDeckScene.layer = finalScene;
        jc.editDeckScene.addChild(jc.editDeckScene.layer );
        jc.editDeckScene.layer.init();

    }
    return jc.editDeckScene;
};

