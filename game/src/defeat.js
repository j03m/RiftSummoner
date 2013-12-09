var Defeat = jc.UiElementsLayer.extend({
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
            this.name = "Defeat";
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.start();

    },
    inTransitionsComplete:function(){
        jc.log(['defeatdialog'], "oh noes");
    },
    outTransitionsComplete:function(){
        jc.log(['defeatdialog'], "oh noes");
    },
    targetTouchHandler: function(type, touch, sprites) {
        jc.log(['defeatdialog', 'touchcore'], "oh noes");
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
                        "y": 125
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


