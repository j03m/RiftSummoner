var Victory = jc.UiElementsLayer.extend({
    deck:[],
    cards:{},
    touchTargets:[],
    cellWidth:200,
    cells:20,
    cardLayer:undefined,
    playMap:{},
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            this.initFromConfig(this.windowConfig);
            this.name = "Victory";
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();

    },
    inTransitionsComplete:function(){
        console.log("woot");
    },
    outTransitionsComplete:function(){
        console.log("woot2");
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },
    close:function(){
        this.onDone();
    },
    onDone:function(){},
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"topToMid",
            "transitionOut":"top",
            "sprite":"victoryScreenWindow.png",
            "kids":{
                "okButton":{
                    "cell":1,
                    "anchor":['center'],
                    "padding":{
                        "top":70,
                        "left":53
                    },
                    "type":"button",
                    "main":"buttonOk.png",
                    "pressed":"buttonOk.png",
                    "touchDelegateName":"close",
                    "z":1

                },
            }
        }
    }
});


