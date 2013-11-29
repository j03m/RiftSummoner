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
        console.log("oh noes");
    },
    outTransitionsComplete:function(){
        console.log("oh noes");
    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },
    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"topToMid",
            "transitionOut":"top",
            "sprite":"defeatWindow.png",

        }
    }
});


