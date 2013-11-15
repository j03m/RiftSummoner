var Loading = jc.UiElementsLayer.extend({
    init: function(assets, nextScene) {
        this.assets = assets;
        this.nextScene = nextScene;
        if (this._super()) {
            cc.SpriteFrameCache.getInstance().addSpriteFrames(loadingPlist);
            this.initFromConfig(this.windowConfig);
            this.start();
            return true;
        } else {
            return false;
        }
    },
    inTransitionsComplete:function(){
        //put the spinner in
        this.animationDone = true;
        this.spinner = jc.makeSpriteWithPlist(loadingPlist,loadingPng, "loader1.png");
        this.addChild(this.spinner);
        this.spinner.setPosition(cc.p((this.winSize.width/2)-1, (this.winSize.height/2)+26));
        cc.Loader.preload(this.assets, function(){
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader20.png");
            this.spinner.setDisplayFrame(frame);
            this.done();
            this.unschedule(this.checkPercent);
            this.scheduleOnce(function(){
                hotr.changeScene(this.nextScene);
            }.bind(this));

        }.bind(this));
        this.schedule(this.checkPercent);
    },
    checkPercent:function(){
        //implement loading bar once we have the sprites
        if (this.animationDone){
            var loader = cc.Loader.getInstance();

            var val = loader.getPercentage();
            var part = Math.floor(val * 20/100);
            if (part < 1){
                part = 1;
            }
            if (part > 20){
                part = 20;
            }
            var frame = cc.SpriteFrameCache.getInstance().getSpriteFrame("loader"+part+".png");
            this.spinner.setDisplayFrame(frame)
        }
    },
    windowConfig:{
        "leftDoor":{
            "type":"sprite",
            "transitionIn":"left",
            "transitionOut":"left",
            "cell":4,
            "anchor":['left'],
            "sprite":"leftDoor.png",
            "padding":{
                left:10,
            }

        },
        "rightDoor":{
            "type":"sprite",
            "transitionIn":"right",
            "transitionOut":"right",
            "cell":6,
            "anchor":['right'],
            "sprite":"rightDoor.png",
            "padding":{
                left:-10,
            }

        }
    }
});

