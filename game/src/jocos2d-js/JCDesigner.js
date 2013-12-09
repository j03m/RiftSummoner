var jc = jc || {};
jc.Designer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            var guideSprite = new cc.Sprite();
            guideSprite.initWithFile(guide);
            cc.SpriteFrameCache.getInstance().addSpriteFrame(guideSprite.displayFrame(), "guide");
            this.designMode = true;
            this.initFromConfig(this.windowConfig);
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();
    },
    targetTouchHandler:function(type, touch, sprites) {
        var theSprite = _.sortBy(sprites, function(sprite){
           return sprite.getZOrder();
        })[sprites.length-1];

        if (type == jc.touchBegan){
            jc.log(['console'], theSprite.name);
            this.moving = theSprite;
            this.startPos = theSprite.getPosition();
            this.lastTouch = touch;
        }
        if (type == jc.touchMoved && this.moving){
            var dx = touch.x - this.lastTouch.x;
            var dy = touch.y - this.lastTouch.y;
            var x = this.startPos.x+dx;
            var y = this.startPos.y+dy;
            this.lastTouch = touch;
            this.startPos = cc.p(x,y);
            this.moving.setPosition(this.startPos);
        }
        if (type == jc.touchEnded){
            this.moving = undefined;
        }
    },
    doClickOn:function(name){
        var theSprite = this[name];
        this.moving = theSprite;
        this.startPos = theSprite.getPosition();
        this.lastTouch = cc.p(0,0);

    },
    dump:function(){
       this.doDump(this, this.windowConfig);
       jc.log(['console'], this.windowConfig);
    },
    doDump:function(entity, config){
        var children = entity.getChildren();
        for (var i =0; i<children.length;i++){
            var child = children[i];
            if (child.name){
                config[child.name].pos = child.getPosition();
                config[child.name].z = child.getZOrder();
                if (config[child.name].kids){
                    this.doDump(child, config[child.name].kids);
                }
            }
        }

    },
    windowConfig:{
        "mainFrame":{
            "cell": 5,
            "type": "sprite",
            "transitionIn": "topToMid",
            "transitionOut": "top",
            "sprite": "defeatWindow.png",
            "kids": {
                "okButton": {
                    "type": "button",
                    "main": "buttonOk.png",
                    "pressed": "buttonOk.png",
                    "touchDelegateName": "close",
                    "z": 1,
                    "pos": {
                        "x": 510,
                        "y": 85
                    }
                }
            },
            "z": 0,
            "pos": {
                "x": 1040,
                "y": 792.0000000000005
            }
        }
    }
});


jc.Designer.create = function() {
    var ml = new jc.Designer();
    if (ml && ml.init()) {
        return ml;
    } else {
        throw "Couldn't create the main layer of the game. Something is wrong.";
    }
    return null;
};

jc.Designer.scene = function() {

        jc.Designer.scene = cc.Scene.create();
        jc.Designer.scene.layer = jc.Designer.create();
        jc.Designer.scene.layer.retain();
        jc.Designer.scene.addChild(jc.Designer.scene.layer);
        return jc.Designer.scene;
};

