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
        jc.log(['victory'], "in transition complete");
    },
    outTransitionsComplete:function(){
        jc.log(['victory'], "out transition complete");
    },
    targetTouchHandler: function(type, touch, sprites) {
        return false;
    },
    close:function(){
        this.onDone();
    },
    onDone:function(){},
    windowConfig:{
        "mainFrame":{
            "cell": 5,
            "type": "sprite",
            "transitionIn": "topToMid",
            "transitionOut": "top",
            "sprite": "victoryScreenWindow.png",
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


