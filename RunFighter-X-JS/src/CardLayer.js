var CardLayer = jc.TouchLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(portraitsPlist);
            this.doneButton = new jc.CompositeButton();
            this.addChild(this.doneButton);

            this.closeButton = new jc.CompositeButton();
            this.addChild(this.closeButton);
            this.closeButton.setPosition(cc.p(160,115));
            this.closeButton.initWithDefinition({
                main:"ex.png",
                pressed:"ex.png"
            }, this.closeButtonClicked.bind(this));

            this.doneButton.setPosition(cc.p(120,-35));
            this.doneButton.initWithDefinition({
                    "main":"button_normal.png",
                    "pressed":"button_pushed.png",
                    "subs":[
                        {"name":"button_left_decoration.png", "x":30, "y":15},
                        {"name":"button_right_decoration.png", "x":70, "y":15},
                        {"name":"button_shadow.png", "x":52, "y":15},
                    ],
                    text:"Done",
                    font:"Helvetica",
                    fontSize:8
                }, this.doneButtonClicked.bind(this));

            this.doneButton.setVisible(false);
            this.wireInput();
            return true;
        } else {
            return false;
        }
    },
    setCloseCallback: function(delegate){
        this.close = delegate;
    },
    closeButtonClicked: function(){
        this.close();
    },
    setDoneCallback: function(delegate){
        this.done = delegate;
    },
    doneButtonClicked: function(){
        this.done();
    },
    targetTouchHandler: function(type, touch, sprites) {

    },
    swapCharacter:function(characterEntry){
        if (this.char){
            var f1 =  cc.FadeOut.create(jc.defaultTransitionTime/4, 0)
            this.nextEntry = characterEntry;
            this.char.runAction(cc.Sequence.create(f1,cc.CallFunc.create(this.displayNewCard.bind(this))))
        }else{
            var portraitFrame = jc.getCharacterPortrait(characterEntry);
            this.char = cc.Sprite.create();
            this.char.initWithSpriteFrameName(portraitFrame);
            this.addChild(this.char);
            this.char.setPosition(cc.p(-115,35));
            this.doneButton.setVisible(true);
        }

    },
    displayNewCard:function(){
        var portraitFrame = jc.getCharacterPortrait(this.nextEntry);
        var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame(portraitFrame);
        this.char.setDisplayFrame(frame);
        var f2 =  cc.FadeIn.create(jc.defaultTransitionTime/4, 255);
        this.char.runAction(f2);
    }
});

jc.getCharacterPortrait=function(entry){
    //TODO: Mod to correct portrait - alive vs hurt based on state
    return "crunch-portrait.png"; //todo implement me
}

jc.getCharacterPortraitRect=function(entry){
    //todo: make char specific
    return cc.RectMake(50,20, 35,55);
}

jc.getMiniPortraitRect = function(entry){

    var portraitFrame = jc.getCharacterPortrait(entry);
    var cropSprite = cc.Sprite.create();
    cropSprite.initWithSpriteFrameName(portraitFrame);
    var texture = cropSprite.getTexture();
    cropSprite.release();
    var croppedSprite = cc.Sprite.create();
    var frame = cc.SpriteFrame.createWithTexture(texture, jc.getCharacterPortraitRect(entry));
    croppedSprite.initWithSpriteFrame(frame);
    //croppedSprite.initWithSpriteFrameName(portraitFrame);
    return croppedSprite;

}




