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
    topToMid:function(doneDelegate){
        var itemRect = this.mainFrame.getTextureRect();
        var fromX = this.winSize.width/2;
        var fromY = (this.winSize.height + itemRect.width); //offscreen left
        var toX = fromX;
        var toY = this.winSize.height/2;
        var to = cc.p(toX, toY);

        this.slide(this.mainFrame, cc.p(fromX,fromY), to, jc.defaultTransitionTime, cc.p(0,jc.defaultNudge), "after",doneDelegate);

    },
    targetTouchHandler: function(type, touch, sprites) {
        console.log(sprites[0].name);
        return false;
    },

    windowConfig:{
        "mainFrame":{
            "cell":5,
            "type":"sprite",
            "transitionIn":"custom",
            "executeIn":"topToMid",
            "transitionOut":"top",
            "sprite":"victoryScreenWindow.png",

        }
    }
});


