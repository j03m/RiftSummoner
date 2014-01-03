var MapLayer = jc.UiElementsLayer.extend({
    init: function() {
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(uiPlist);
            cc.SpriteFrameCache.getInstance().addSpriteFrames(touchUiPlist);
            this.initFromConfig(this.windowConfig);
            this.bubbleAllTouches(true);

            jc.log(['map'], 'init');
            this.tutorialStep1 = cc.p(500 * jc.assetScaleFactor,500* jc.assetScaleFactor);
            this.tutorialStep2 = cc.p(400 * jc.assetScaleFactor,600* jc.assetScaleFactor);
            this.tutorialStep3 = cc.p(400 * jc.assetScaleFactor,600* jc.assetScaleFactor);
            this.start();
            return true;
        } else {
            return false;
        }
    },
    onShow:function(){
        this.allowOnce = false;
        jc.log(['map'], 'show');
        //play ftue step
        this.level = hotr.blobOperations.getTutorialLevel();
        jc.log(['map'], 'level:'+this.level);
        if (this.level == 0){
            hotr.blobOperations.incrementLevel();
            this.level =1;
        }
        if (this.level == 1){
            jc.log(['map'], 'ftue');
            //(msg, time, direction, character, callbackIn, callbackOut){
            hotr.blobOperations.setTutorialStep(1);
            this.showTutorialStep("Summoner, we've been waiting for you. The enemy approaches!",
                                   undefined,
                                   "left",
                                   "girl");
            this.step = 1;

        }

    },
    targetTouchHandler:function(type, touch, sprites) {
        //any touch -
        jc.log(['map'], 'touch:' + type);
        if (type == jc.touchEnded){
            if (this.level==1){
                this.level1Tutorial();
            }


        }

        return true;

    },
    level1Tutorial:function(){
        if (this.step == 1){
            this.showTutorialStep("Yea, son! We're gonna burn your village and steal your girl friend!",
                undefined,
                "right",
                "orc");
            this.step=2;
        }else if (this.step == 2){
           this.removeTutorialStep('orc', 'right', function(){
               this.attachMsgTo("We can't let that happen, click the map to head them off at the old arena!", this.guideCharacters['girl'], 'right');
               this.step =3;
           }.bind(this));


        }else if (this.step == 3){
            this.removeTutorialStep ('girl', 'left');
            this.placeArrow(this.tutorialStep1, "down");
            this.step = 4;
        }else if (this.step == 4){
            jc.log(['map'], 'touch ended');
            if (!this.allowOnce){
                this.allowOnce = true;
                jc.log(['map'], 'going to team');
                this.removeChild(this.arrow, true);
                hotr.mainScene.layer.arenaPre();
            }
        }
    },
    windowConfig: {
        "mainFrame": {
            "applyAdjustments":true,
            "type": "sprite",
            "sprite": "map.png",
            "z": 1,
            "pos": {
                "x": 1019,
                "y": 767
            }
        }
    }
});

MapLayer.scene = function() {
    if (!hotr.mapScene){
        hotr.mapScene = cc.Scene.create();
        hotr.mapScene.retain();
        hotr.mapScene.layer = new MapLayer();

        hotr.mapScene.addChild(hotr.mapScene.layer);
        hotr.mapScene.layer.init();

    }
    return hotr.mapScene;
};
